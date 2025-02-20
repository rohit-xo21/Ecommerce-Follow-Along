import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

function ProductUploadForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingProduct = location.state?.product || null; // Get product data if available
  const isEditing = Boolean(existingProduct); // Check if it's edit mode

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    price: "",
    category: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        description: existingProduct.description || "",
        originalPrice: existingProduct.originalPrice || "",
        price: existingProduct.price || "",
        category: existingProduct.category || "",
        stock: existingProduct.stock || "",
      });

      setPreviewImages(existingProduct.images || []);
    }
  }, [existingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Clean up memory
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    images.forEach((image) => {
      submitData.append(`images`, image);
    });

    try {
      let response;
      const url = isEditing
        ? `http://localhost:2022/api/products/${existingProduct._id}`
        : "http://localhost:2022/api/products/add";
      const method = isEditing ? "put" : "post";

      response = await axios({
        method,
        url,
        data: submitData,
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(isEditing ? "Product updated successfully" : "Product added successfully", response.data);
      navigate("/shop");
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert(`Failed to ${isEditing ? "update" : "add"} product. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!Cookies.get("authToken")) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {Object.entries(formData).map(([key, value]) => (
            <div className="space-y-2" key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          <div className="grid grid-cols-4 gap-4">
            {previewImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <Camera className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Add Image</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
          >
            {isSubmitting ? (isEditing ? "Updating Product..." : "Adding Product...") : (isEditing ? "Update Product" : "Add Product")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductUploadForm;
