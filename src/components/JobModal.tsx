import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  Textarea,
  Button,
} from "@heroui/react";

interface JobFormData {
  title: string;
  description: string;
  price: number;
  contractPeriod: number;
}

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => Promise<void>;
  initialData?: JobFormData;
  mode: "create" | "edit";
}

const JobModal = ({ isOpen, onClose, onSubmit, initialData, mode }: JobModalProps) => {
  const [formData, setFormData] = useState<JobFormData>(
    initialData || {
      title: "",
      description: "",
      price: 0,
      contractPeriod: 0,
    }
  );
  const [loading, setLoading] = useState(false);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: Number(initialData.price),
        contractPeriod: Number(initialData.contractPeriod),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: 0,
        contractPeriod: 0,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      if (mode === "create") {
        setFormData({
          title: "",
          description: "",
          price: 0,
          contractPeriod: 0,
        });
      }
      onClose();
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          {mode === "create" ? "Create New Job" : "Edit Job"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            
            <Textarea
              label="Job Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            
            <Input
              type="number"
              label="Price"
              value={formData.price.toString()}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
            
            <Input
              type="number"
              label="Contract Period (Days)"
              value={formData.contractPeriod.toString()}
              onChange={(e) => setFormData({ ...formData, contractPeriod: Number(e.target.value) })}
              required
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="flat"
                color="danger"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={loading}
              >
                {mode === "create" ? "Create Job" : "Update Job"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default JobModal; 