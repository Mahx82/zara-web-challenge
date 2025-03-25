import React from 'react';

export interface CarouselProps {
  children: React.ReactElement[];
}

export function Carousel({ children }: CarouselProps) {
  return (
    <ul className="mb-6 flex max-w-[960px] items-center gap-4 overflow-x-auto pb-4 pl-4 [scrollbar-color:var(--color-marvel-red)_#d9d9d9] [scrollbar-width:thin] md:mx-auto">
      {children}
    </ul>
  );
}

export interface CarouselItemProps {
  image: string;
  name: string;
  info: string;
}

function Item({ image, name, info, ...rest }: CarouselItemProps) {
  return (
    <li {...rest}>
      <div className="h-[318px] w-[179px] overflow-hidden">
        <img className="mx-auto h-full object-cover" src={image} alt={name} />
      </div>
      <div className="py-2">
        <div className="font-bold text-black">{name}</div>
        <div className="text-xs text-black">{info}</div>
      </div>
    </li>
  );
}

Carousel.Item = Item;
