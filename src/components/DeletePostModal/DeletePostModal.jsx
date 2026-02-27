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

export default function DeletePostModal({
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
              Delete post confirmation
            </ModalHeader>

            <ModalBody>
              <p>Are you sure you want to delete your post?</p>
            </ModalBody>

            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={close}
                disabled={isLoading}
              >
                No
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
