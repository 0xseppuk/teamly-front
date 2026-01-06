'use client';

import {
  useGetUserApplications,
  useDeleteApplication,
} from '@/shared/services/applications';
import { GameApplication } from '@/shared/services/applications/applications.types';
import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { addToast } from '@heroui/toast';
import { useDisclosure } from '@heroui/use-disclosure';
import { useState } from 'react';
import { ApplicationsList } from './ApplicationsList';
import { CreateApplicationModal } from './CreateApplicationModal';
import { EmptyState } from './EmptyState';

export function AddApplication() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const { data } = useGetUserApplications();
  const deleteMutation = useDeleteApplication();
  const [editingApplication, setEditingApplication] = useState<
    GameApplication | undefined
  >(undefined);
  const [deletingApplicationId, setDeletingApplicationId] = useState<
    string | null
  >(null);

  const hasApplications = (data?.applications.length || 0) > 0;

  const handleCreateClick = () => {
    setEditingApplication(undefined);
    onOpen();
  };

  const handleEditClick = (application: GameApplication) => {
    setEditingApplication(application);
    onOpen();
  };

  const handleDeleteClick = (id: string) => {
    setDeletingApplicationId(id);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!deletingApplicationId) return;

    try {
      await deleteMutation.mutateAsync(deletingApplicationId);
      addToast({
        title: 'Заявка удалена',
        description: 'Заявка успешно удалена',
        color: 'success',
      });
      onDeleteOpenChange();
      setDeletingApplicationId(null);
    } catch (error) {
      addToast({
        title: 'Ошибка',
        description: 'Не удалось удалить заявку',
        color: 'danger',
      });
    }
  };

  const handleCancelDelete = () => {
    setDeletingApplicationId(null);
    onDeleteOpenChange();
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setEditingApplication(undefined);
    }
    onOpenChange();
  };

  return (
    <>
      {hasApplications ? (
        <ApplicationsList
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <EmptyState onCreateClick={handleCreateClick} />
      )}
      <CreateApplicationModal
        isOpen={isOpen}
        onOpenChange={handleModalClose}
        editApplication={editingApplication}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} size="sm">
        <ModalContent>
          <ModalHeader>Удалить заявку?</ModalHeader>
          <ModalBody>
            <p className="text-default-600">
              Вы уверены, что хотите удалить эту заявку? Это действие нельзя
              отменить.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={handleCancelDelete}>
              Отмена
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
