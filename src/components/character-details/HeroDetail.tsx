import { FavoriteButton } from '@/components/shared/FavoriteButton';

interface HeroDetailProps {
  id: number;
  image: string;
  name: string;
  description: string;
}

export function HeroDetail(props: HeroDetailProps) {
  const { description, ...character } = props;
  const { name, image } = character;

  return (
    <div className="overflow-hidden bg-black hero-mask">
      <div className="mx-auto max-w-[960px] md:mx-12 md:flex md:items-center md:justify-center md:gap-12 lg:mx-auto">
        <img
          className="mx-auto h-[393px] p-4 drop-shadow-[0_0_45px_#fefeb2]"
          src={image}
          alt={name}
        />
        <div className="bg-black px-4 pt-6 pb-12 hero-mask">
          <div className="flex items-baseline gap-4">
            <h1 className="mb-6 text-[32px] font-bold text-white uppercase">
              {name}
            </h1>
            <FavoriteButton
              className="ml-auto h-[22px] cursor-pointer"
              character={character}
            />
          </div>
          <p className="text-white">{description}</p>
        </div>
      </div>
    </div>
  );
}
