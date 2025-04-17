import { useCharacterById } from '@/hooks/queries/useCharacterById';
import { Carousel } from '@/components/character-details/Carousel';
import { HeroDetail } from '@/components/character-details/HeroDetail';
import { useParams } from 'react-router';
import { CharacterByIdResponse } from '@/services/types';
import { sortByKi } from '@/utils/sortByKi';
import { useLoader } from '@/hooks/useLoader';
import { ProgressBar } from '@/components/shared/ProgressBar';

interface Transformations {
  id: number;
  image: string;
  name: string;
  ki: string;
}

export function CharacterDetail() {
  const params = useParams();
  const { data, isLoading, isError, error } = useCharacterById(
    parseInt(params.id ?? '1'),
  );
  const { progress, isLoaderVisible } = useLoader(isLoading);

  const {
    id,
    name,
    image,
    description,
    transformations = [],
  } = (data ?? {}) as CharacterByIdResponse;

  if (isError) {
    return (
      <div className="mt-12 flex h-full items-center justify-center">
        {error.message}
      </div>
    );
  }

  if (isLoaderVisible) {
    return (
      <ProgressBar progress={progress} label="Loading character details" />
    );
  }

  return (
    <>
      <HeroDetail id={id} name={name} image={image} description={description} />
      <h2 className="mx-4 mt-12 mb-6 max-w-[960px] text-2xl font-bold text-black uppercase md:mx-12 lg:mx-auto">
        Transformations
      </h2>
      {transformations.length > 0 ? (
        <Carousel>
          {sortByKi(transformations).map(
            ({ id, image, name, ki }: Transformations) => {
              return (
                <Carousel.Item
                  key={id}
                  image={image}
                  name={name}
                  info={ki}
                  data-testid="transformation"
                />
              );
            },
          )}
        </Carousel>
      ) : (
        <div className="mx-4 max-w-[960px] md:mx-12 lg:mx-auto">
          This character has no transformations.
        </div>
      )}
    </>
  );
}
