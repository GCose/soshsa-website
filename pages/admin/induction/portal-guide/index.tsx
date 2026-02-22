import { useState } from "react";
import { Plus, Edit, Trash2, Upload, MoveUp, MoveDown } from "lucide-react";
import Input from "@/components/dashboard/ui/InputField";
import Sheet from "@/components/dashboard/ui/Sheet";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";
import { PortalGuideSection } from "@/types/interface/dashboard";
import Image from "next/image";

const PortalGuidePage = () => {
  const [sections, setSections] = useState<PortalGuideSection[]>([
    {
      id: "1",
      heading: "Accessing the Portal",
      body: "Navigate to portal.utg.edu.gm and enter your student credentials. Your username is typically your student ID number, and your initial password would have been provided during registration.",
      image: null,
      order: 1,
    },
  ]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSection, setEditingSection] =
    useState<PortalGuideSection | null>(null);
  const [formData, setFormData] = useState({
    heading: "",
    body: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const handleOpenSheet = (section?: PortalGuideSection) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        heading: section.heading,
        body: section.body,
        image: null,
      });
      setImagePreview(section.image);
    } else {
      setEditingSection(null);
      setFormData({ heading: "", body: "", image: null });
      setImagePreview(null);
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingSection(null);
    setFormData({ heading: "", body: "", image: null });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      setSections(
        sections.map((section) =>
          section.id === editingSection.id
            ? { ...section, heading: formData.heading, body: formData.body }
            : section,
        ),
      );
    } else {
      const newSection: PortalGuideSection = {
        id: Date.now().toString(),
        heading: formData.heading,
        body: formData.body,
        image: imagePreview,
        order: sections.length + 1,
      };
      setSections([...sections, newSection]);
    }
    handleCloseSheet();
  };

  const handleDelete = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [
      newSections[index],
      newSections[index - 1],
    ];
    newSections.forEach((section, idx) => {
      section.order = idx + 1;
    });
    setSections(newSections);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ];
    newSections.forEach((section, idx) => {
      section.order = idx + 1;
    });
    setSections(newSections);
  };

  return (
    <DashboardLayout pageTitle="Portal Guide">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              UTG Portal Guide
            </h2>
            <p className="text-gray-600 mt-1">
              Manage the portal familiarization content for students
            </p>
          </div>
          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Section
          </button>
        </div>

        <div className="space-y-4">
          {sections.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No sections added yet. Create your first section to get started.
              </p>
            </div>
          ) : (
            sections.map((section, index) => (
              <div
                key={section.id}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {section.heading}
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {section.body}
                    </p>
                    {section.image && (
                      <div className="mt-4">
                        <Image
                          src={section.image}
                          alt={section.heading}
                          className="h-32 rounded object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="cursor-pointer p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <MoveUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sections.length - 1}
                      className="cursor-pointer p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <MoveDown size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenSheet(section)}
                      className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({ isOpen: true, id: section.id })
                      }
                      className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Sheet
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        title={editingSection ? "Edit Section" : "Add Section"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Section Heading"
            type="text"
            placeholder="e.g., Accessing the Portal"
            value={formData.heading}
            onChange={(e) =>
              setFormData({ ...formData, heading: e.target.value })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              rows={8}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Write the detailed guide content here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Image
            </label>
            {imagePreview && (
              <div className="mb-4">
                <Image
                  alt="Preview"
                  src={imagePreview}
                  className="h-48 rounded-lg object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="section-image"
            />
            <label
              htmlFor="section-image"
              className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} />
              {imagePreview ? "Change Image" : "Upload Image"}
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {editingSection ? "Update Section" : "Add Section"}
            </button>
            <button
              type="button"
              onClick={handleCloseSheet}
              className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Sheet>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="Delete Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default PortalGuidePage;
