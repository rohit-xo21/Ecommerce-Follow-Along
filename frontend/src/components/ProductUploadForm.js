import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProductUploadForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        originalPrice: '',
        salePrice: '',
        category: '',
        stock: '',
        images: []
    });

    const [previewImages, setPreviewImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateDiscount = () => {
        const original = parseFloat(formData.originalPrice);
        const sale = parseFloat(formData.salePrice);
        if (original && sale && original > sale) {
            const discount = ((original - sale) / original * 100).toFixed(1);
            return `${discount}% off`;
        }
        return '';
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData object to handle file uploads
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                formData.images.forEach(image => {
                    submitData.append('images', image);
                });
            } else {
                submitData.append(key, formData[key]);
            }
        });

        // Here you would typically make an API call to your backend
        console.log('Form submitted:', Object.fromEntries(submitData));
        // Example API call:
        // const response = await fetch('/api/products', {
        //   method: 'POST',
        //   body: submitData
        // });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="originalPrice">Original Price</Label>
                            <Input
                                id="originalPrice"
                                name="originalPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.originalPrice}
                                onChange={handleInputChange}
                                required
                                className="w-full"
                                placeholder="Original price"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salePrice">Sale Price</Label>
                            <div className="relative">
                                <Input
                                    id="salePrice"
                                    name="salePrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.salePrice}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full"
                                    placeholder="Sale price"
                                />
                                {calculateDiscount() && (
                                    <span className="absolute right-2 top-2 text-sm text-green-600 font-medium">
                                        {calculateDiscount()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Product Images</Label>
                        <div className="grid grid-cols-4 gap-4">
                            {previewImages.map((url, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
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
                    </div>

                    <Button type="submit" className="w-full">
                        Add Product
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProductUploadForm;