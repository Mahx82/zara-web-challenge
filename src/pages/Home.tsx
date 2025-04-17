import { useFilters } from '@/hooks/useFilters';
import { CharacterList } from '@/components/home/CharacterList';
import { ResultsCounter } from '@/components/home/ResultsCounter';
import { SearchInput } from '@/components/home/SearchInput';
import { useCharactersList } from '@/hooks/queries/useCharactersList';
import { useFavoritesContext } from '@/contexts/favorites/useFavoritesContext';
import { useCallback } from 'react';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useLoader } from '@/hooks/useLoader';

export function Home() {
  const { characterName, setFilters } = useFilters();
  const { favorites, favoritesResults, isShowingFavorites } =
    useFavoritesContext();
  const {
    data: { characters, count } = {},
    isLoading,
    isError,
  } = useCharactersList(!isShowingFavorites, characterName);
  const { progress, isLoaderVisible } = useLoader(isLoading);

  const charactersToRender = isShowingFavorites
    ? favorites
    : (characters ?? []);
  const charactersResults = isShowingFavorites ? favoritesResults : count;

  const handleSearch = useCallback(
    (characterSearch: string) => {
      setFilters({ characterSearch });
    },
    [setFilters],
  );

  if (isError) {
    return (
      <div className="mx-4 my-6 md:mx-12">
        An error occurred. Please try again later.
      </div>
    );
  }

  if (isLoaderVisible) {
    return <ProgressBar progress={progress} label="Loading characters" />;
  }

  return (
    <>
      <div className="mx-auto mt-6 max-w-[1512px]">
        {isShowingFavorites && (
          <h1 className="mx-4 mb-6 text-[32px] font-bold uppercase md:mx-12">
            Favorites
          </h1>
        )}
        <SearchInput
          onSearch={handleSearch}
          initialValue={characterName}
          key={characterName ?? 'clean-search-input'}
        />
        <ResultsCounter count={charactersResults} />
      </div>

      <div className="mx-4 my-6 md:mx-12">
        {charactersToRender.length === 0 &&
          !isLoading &&
          'No characters found.'}
        {charactersToRender.length > 0 && (
          <CharacterList>
            {charactersToRender.map(({ name, image, id }) => (
              <CharacterList.Card key={id} name={name} image={image} id={id} />
            ))}
          </CharacterList>
        )}
      </div>
    </>
  );
}
