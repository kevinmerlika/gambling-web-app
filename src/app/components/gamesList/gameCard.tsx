'use client';

import React from 'react';
import Link from 'next/link';
import { CarouselItem } from '@/components/ui/carousel';

interface GameCardProps {
    title: string;
    content: string;
    description?: string;
    image?: string;
    url?: string; // Make it optional if necessary
}

const GameCard: React.FC<GameCardProps> = ({ title, content, description, image, url = '/' }) => {
    const Content = (
        <CarouselItem className="md:basis-1/2 lg:basis-1/3 cursor-pointer">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-32 sm:h-40 object-cover"
                />
            )}
            <div className="p-3">
                <h3 className="text-xl font-semibold text-gray-600 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm mb-1">{content}</p>
                {description && (
                    <p className="text-gray-500 text-xs">{description}</p>
                )}
            </div>
        </CarouselItem>
    );

    return url ? (
        <Link href={"/games/"+url}>{Content}</Link>
    ) : (
        Content
    );
};

export default GameCard;
