'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Camera, Plus, X } from 'lucide-react';
import PageHeader from '@/components/page-header';

const UpdatePhysique = () => {

    const [weight, setWeight] = useState('');
    const [bodyFat, setBodyFat] = useState('');
    const [chest, setChest] = useState('');
    const [waist, setWaist] = useState('');
    const [arms, setArms] = useState('');
    const [legs, setLegs] = useState('');
    const [shoulders, setShoulders] = useState('');
    const [notes, setNotes] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // Limitar a 4 imagens
        if (previewUrls.length + files.length > 4) {
            alert('Você pode enviar no máximo 4 imagens');
            return;
        }

        Array.from(files).forEach(file => {
            // Verificar tamanho e tipo
            if (file.size > 5 * 1024 * 1024) {
                alert('As imagens devem ter no máximo 5MB');
                return;
            }

            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                alert('Apenas imagens JPEG e PNG são permitidas');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setPreviewUrls(prev => [...prev, result]);
                setImages(prev => [...prev, result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="">
            <PageHeader title="Atualizar Físico" description="Atualize seu perfil físico para acompanhar o seu progresso" />
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Medidas</CardTitle>
                            <CardDescription>Informe suas medidas atuais</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Peso (kg) *</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bodyFat">Gordura corporal (%)</Label>
                                    <Input
                                        id="bodyFat"
                                        type="number"
                                        step="0.1"
                                        value={bodyFat}
                                        onChange={(e) => setBodyFat(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="chest">Peitoral (cm)</Label>
                                    <Input
                                        id="chest"
                                        type="number"
                                        step="0.1"
                                        value={chest}
                                        onChange={(e) => setChest(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="waist">Cintura (cm)</Label>
                                    <Input
                                        id="waist"
                                        type="number"
                                        step="0.1"
                                        value={waist}
                                        onChange={(e) => setWaist(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="arms">Braços (cm)</Label>
                                    <Input
                                        id="arms"
                                        type="number"
                                        step="0.1"
                                        value={arms}
                                        onChange={(e) => setArms(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="legs">Pernas (cm)</Label>
                                    <Input
                                        id="legs"
                                        type="number"
                                        step="0.1"
                                        value={legs}
                                        onChange={(e) => setLegs(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shoulders">Ombros (cm)</Label>
                                    <Input
                                        id="shoulders"
                                        type="number"
                                        step="0.1"
                                        value={shoulders}
                                        onChange={(e) => setShoulders(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Imagens</CardTitle>
                            <CardDescription>Envie fotos para mostrar seu progresso</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}

                                {previewUrls.length < 4 && (
                                    <div className="aspect-square">
                                        <label
                                            htmlFor="image-upload"
                                            className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-accent/20 transition-colors"
                                        >
                                            <Camera className="h-8 w-8 mb-2 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {previewUrls.length === 0 ? 'Adicionar fotos' : 'Adicionar mais'}
                                            </span>
                                        </label>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/jpeg, image/png"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            multiple
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Máximo de 4 imagens (JPEG ou PNG, 5MB cada)
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Observações</CardTitle>
                            <CardDescription>Adicione notas ou comentários sobre sua condição atual</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Descreva como você está se sentindo, qualquer dificuldade, etc."
                                className="min-h-32"
                            />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar atualização'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default UpdatePhysique;