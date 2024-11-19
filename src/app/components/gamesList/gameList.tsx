'use client';
import Autoplay from "embla-carousel-autoplay"


import React from 'react';
import GameCard from './gameCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'; // We will keep CarouselItem for each game inside the carousel

interface Game {
  id: number;
  title: string;
  content: string;
  description?: string;
  image?: string;
  url: string;
}

interface GamesListProps {
  games: Game[];
}

const GamesList: React.FC<GamesListProps> = ({ games }) => {
  return (
    <div className="my-8 bg-gray-800 p-6 rounded-lg relative">
      <h2 className="text-3xl font-semibold mb-6 text-center text-white">Available Games</h2>
      
      <Carousel  plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}>
        {/* Navigation buttons outside of the Carousel */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white">
          <CarouselPrevious className="cursor-pointer">
            &lt; {/* Left arrow or custom icon */}
          </CarouselPrevious>
        </div>

        <CarouselContent>
          {games.map((game) => (
            <CarouselItem key={game.id} className="md:basis-1/2 lg:basis-1/3">
              <GameCard
                title={game.title}
                content={game.content}
                description={game.description}
                image={game.image}
                url={game.id.toString()}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white">
          <CarouselNext className="cursor-pointer">
            &gt; {/* Right arrow or custom icon */}
          </CarouselNext>
        </div>
      </Carousel>
    </div>
  );
};

export default GamesList;
