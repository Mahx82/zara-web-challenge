import { useFilters } from '@/hooks/useFilters';
import { CharacterList } from '@/components/home/CharacterList';
import { ResultsCounter } from '@/components/home/ResultsCounter';
import { SearchInput } from '@/components/home/SearchInput';
import { useCharactersList } from '@/hooks/queries/useCharactersList';
import { useFavoritesContext } from '@/contexts/favorites/useFavoritesContext';
import { useCallback } from 'react';

export function Home() {
  const { characterName, setFilters } = useFilters();
  const { favorites, favoritesCount, isShowingFavorites } =
    useFavoritesContext();
  const {
    data: { characters, count } = {},
    isPending,
    isError,
  } = useCharactersList(!isShowingFavorites, characterName);

  const charactersToRender = isShowingFavorites ? favorites : characters;
  const charactersCount = isShowingFavorites ? favoritesCount : count;

  const handleSearch = useCallback(
    (characterName: string) => {
      setFilters({ characterSearch: characterName });
    },
    [setFilters],
  );

  return (
    <div className="mx-auto mt-6 max-w-[1512px]">
      {isShowingFavorites && (
        <h1 className="mx-4 mb-6 text-[32px] font-bold uppercase md:mx-12">
          Favorites
        </h1>
      )}
      <SearchInput onSearch={handleSearch} initialValue={characterName} />
      <ResultsCounter count={charactersCount} />
      <div className="mx-4 my-6 md:mx-12">
        {isPending && !isShowingFavorites && <>Loading...</>}
        {isError && <>An error ocurred. Please try again later.</>}
        {!isPending && !isError && characters?.length === 0 && (
          <>No characters found.</>
        )}
        {charactersToRender && charactersToRender.length > 0 && (
          <CharacterList>
            {charactersToRender.map(({ name, image, id }) => (
              <CharacterList.Card key={id} name={name} image={image} id={id} />
            ))}
          </CharacterList>
        )}
      </div>
    </div>
  );
}
