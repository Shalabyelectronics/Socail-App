import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@heroui/react";

export default function DeleteCommentModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Comment Confirmation
            </ModalHeader>

            <ModalBody>
              <p>Are you sure you want to delete this comment?</p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </ModalBody>

            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={close}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button
                color="danger"
                onPress={onConfirm}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Yes, delete"
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
