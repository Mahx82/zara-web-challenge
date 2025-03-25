import { useCharacterById } from '@/hooks/queries/useCharacterById';
import { Carousel } from '@/components/character-details/Carousel';
import { HeroDetail } from '@/components/character-details/HeroDetail';
import { useParams } from 'react-router';
import { CharacterByIdResponse } from '@/services/types';

interface Transformations {
  id: number;
  image: string;
  name: string;
  ki: string;
}

export function CharacterDetail() {
  const params = useParams();
  const { data, isPending, isError, error } = useCharacterById(
    parseInt(params.id ?? '1'),
  );

  if (isPending) {
    return (
      <div className="mt-12 flex h-full items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-12 flex h-full items-center justify-center">
        {error.message}
      </div>
    );
  }

  const {
    id,
    name,
    image,
    description,
    transformations = [],
  } = data as CharacterByIdResponse;

  return (
    <>
      <HeroDetail id={id} name={name} image={image} description={description} />
      <h2 className="mx-4 mt-12 mb-6 max-w-[960px] text-2xl font-bold text-black uppercase md:mx-12 lg:mx-auto">
        Transformations
      </h2>
      {transformations.length > 0 ? (
        <Carousel>
          {transformations.map(({ id, image, name, ki }: Transformations) => {
            return (
              <Carousel.Item key={id} image={image} name={name} info={ki} />
            );
          })}
        </Carousel>
      ) : (
        <div className="mx-4 max-w-[960px] md:mx-12 lg:mx-auto">
          This character has no transformations.
        </div>
      )}
    </>
  );
}
