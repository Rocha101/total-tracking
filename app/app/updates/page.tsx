'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, User } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const physicalUpdates = [
    {
        id: 1,
        date: '2023-08-01',
        reviewed: false,
        status: 'pending',
        athlete: 'John Doe',
        athleteId: '1',
        weight: 75,
        bodyFat: 15,
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.',
        images: [
            'https://source.unsplash.com/400x400/?fitness',
            'https://source.unsplash.com/400x400/?workout',
            'https://source.unsplash.com/400x400/?gym'
        ]
    }
];

const athletes = [
    {
        id: '1',
        name: 'John Doe',
        profileImage: 'https://source.unsplash.com/400x400/?person'
    }
];

type PhysicalUpdate = {
    id: number;
    date: string;
    reviewed: boolean;
    status?: 'approved' | 'rejected';
    athleteId: string;
    weight: number;
    bodyFat: number;
    notes: string;
    images?: string[];
};

const PhysicalUpdates = () => {
    const [filter, setFilter] = useState('pending');

    // Filter updates based on the tab and reviewed status
    const filteredUpdates = physicalUpdates.filter((update) => {
        if (filter === 'pending') return !update.reviewed;
        if (filter === 'approved') return update.reviewed && (update.status === 'approved' || !update.status);
        if (filter === 'rejected') return update.reviewed && update.status === 'rejected';
        return true;
    });

    // Sort by date, newest first
    const sortedUpdates = [...filteredUpdates].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const getAthleteById = (id: string) => {
        return athletes.find(athlete => athlete.id === id) || null;
    };

    const handleUpdateStatus = (update: PhysicalUpdate, newStatus: 'approved' | 'rejected') => {
        console.log(`Update ${update.id} status changed to ${newStatus}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Atualizações Físicas</h1>
                <p className="text-muted-foreground">
                    Revise e aprove atualizações enviadas pelos atletas
                </p>
            </div>

            <Tabs defaultValue="pending" onValueChange={setFilter}>
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="pending">Pendentes</TabsTrigger>
                    <TabsTrigger value="approved">Aprovadas</TabsTrigger>
                    <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6">
                    {sortedUpdates.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <p className="text-muted-foreground">
                                    Não há atualizações {filter === 'pending' ? 'pendentes' :
                                        filter === 'approved' ? 'aprovadas' : 'rejeitadas'} no momento
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {sortedUpdates.map((update) => {
                                const athlete = getAthleteById(update.athleteId);
                                return (
                                    <Card key={update.id}>
                                        <CardHeader className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={athlete?.profileImage} />
                                                    <AvatarFallback><User /></AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <CardTitle className="text-base">{athlete?.name || 'Atleta'}</CardTitle>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(update.date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <div className="grid gap-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium">Peso</p>
                                                        <p>{update.weight} kg</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Gordura Corporal</p>
                                                        <p>{update.bodyFat}%</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium mb-2">Notas</p>
                                                    <p className="text-sm text-muted-foreground">{update.notes}</p>
                                                </div>

                                                {update.images && update.images.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium">Imagens</p>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {update.images.map((img, index) => (
                                                                <div key={index} className="rounded-md overflow-hidden">
                                                                    <AspectRatio ratio={1 / 1}>
                                                                        {/* <img src={img} alt={`Update ${index}`} className="object-cover w-full h-full" /> */}
                                                                        <div className="bg-gray-200 w-full h-full"></div>
                                                                    </AspectRatio>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {filter === 'pending' && (
                                                    <div className="flex justify-end space-x-2 pt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        // onClick={() => handleUpdateStatus(update, 'rejected')}
                                                        >
                                                            <X className="mr-2 h-4 w-4" />
                                                            Rejeitar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                        // onClick={() => handleUpdateStatus(update, 'approved')}
                                                        >
                                                            <Check className="mr-2 h-4 w-4" />
                                                            Aprovar
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PhysicalUpdates;
