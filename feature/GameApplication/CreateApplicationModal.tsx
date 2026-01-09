'use client';

import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Progress } from '@heroui/progress';
import { Spacer } from '@heroui/spacer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { STEPS } from './constants';
import { ApplicationFormData, applicationSchema } from './schema';
import {
  DetailsStep,
  GameSelectionStep,
  PlayersStep,
  ScheduleStep,
} from './steps';
import { getFieldsForStep } from './utils/fieldsForStep';

import {
  useCreateApplication,
  useUpdateApplication,
} from '@/shared/services/applications';
import { GameApplication } from '@/shared/services/applications/applications.types';

interface CreateApplicationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editApplication?: GameApplication;
  onSuccess?: () => void;
}

export function CreateApplicationModal({
  isOpen,
  onOpenChange,
  editApplication,
  onSuccess,
}: CreateApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();

  const isEditMode = !!editApplication;

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      game_id: '',
      title: '',
      description: '',
      min_players: 2,
      max_players: 4,
      prime_time_start: '18:00',
      prime_time_end: '23:00',
      with_voice_chat: false,
      platform: 'pc',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editApplication) {
        const primeTimeStart = new Date(editApplication.prime_time_start)
          .toISOString()
          .substring(11, 16);
        const primeTimeEnd = new Date(editApplication.prime_time_end)
          .toISOString()
          .substring(11, 16);

        form.reset({
          game_id: editApplication.game_id,
          title: editApplication.title,
          description: editApplication.description,
          min_players: editApplication.min_players,
          max_players: editApplication.max_players,
          prime_time_start: primeTimeStart,
          prime_time_end: primeTimeEnd,
          with_voice_chat: editApplication.with_voice_chat,
          platform: editApplication.platform,
        });
      } else {
        // Сбрасываем к дефолтным значениям при создании новой заявки
        form.reset({
          game_id: '',
          title: '',
          description: '',
          min_players: 2,
          max_players: 4,
          prime_time_start: '18:00',
          prime_time_end: '23:00',
          with_voice_chat: false,
          platform: 'pc',
        });
      }
    }
  }, [editApplication, isOpen, form]);

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const formattedData = {
        ...data,
        prime_time_start: `${today}T${data.prime_time_start}:00Z`,
        prime_time_end: `${today}T${data.prime_time_end}:00Z`,
      };

      if (isEditMode && editApplication) {
        await updateMutation.mutateAsync({
          id: editApplication.id,
          data: formattedData,
        });
      } else {
        await createMutation.mutateAsync(formattedData);
      }

      onOpenChange(false);
      form.reset();
      setCurrentStep(0);
      onSuccess?.();
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? 'update' : 'create'} application:`,
        error,
      );
    }
  });

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setCurrentStep(0);
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <Modal
      classNames={{
        base: 'max-h-[90vh]',
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onClose={handleClose}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">
            {isEditMode ? 'Редактировать заявку' : 'Создать заявку'}
          </h2>
          <Progress
            className="mt-2"
            color="secondary"
            size="sm"
            value={progress}
          />
        </ModalHeader>

        <ModalBody>
          {/* Степпер */}
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id}>
                  {/* Step Column */}
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold shadow-sm transition-all ${
                        index < currentStep
                          ? 'border-success bg-success text-white shadow-success/20'
                          : index === currentStep
                            ? 'bg-secondary text-white shadow-primary/30'
                            : 'border-default-300 bg-default-50 text-default-400'
                      }`}
                    >
                      {index < currentStep ? (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          index <= currentStep
                            ? 'text-foreground'
                            : 'text-default-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-default-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Spacer y={4} />

          <div className="min-h-[300px]">
            {currentStep === 0 && <GameSelectionStep control={form.control} />}
            {currentStep === 1 && <DetailsStep control={form.control} />}
            {currentStep === 2 && <PlayersStep control={form.control} />}
            {currentStep === 3 && <ScheduleStep control={form.control} />}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Отмена
          </Button>
          {currentStep > 0 && (
            <Button variant="flat" onPress={handleBack}>
              Назад
            </Button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <Button color="primary" onPress={handleNext}>
              Далее
            </Button>
          ) : (
            <Button
              color="primary"
              isLoading={
                isEditMode ? updateMutation.isPending : createMutation.isPending
              }
              type="submit"
              onPress={() => handleSubmit()}
            >
              {isEditMode ? 'Сохранить изменения' : 'Создать заявку'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
