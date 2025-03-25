import { ChunkyHeartIcon } from '@/components/shared/icons/ChunkyHeartIcon';
import { HeartIcon } from '@/components/shared/icons/HeartIcon';
import { useFavoritesContext } from '@/contexts/favorites/useFavoritesContext';

interface Character {
  name: string;
  image: string;
  id: number;
}

interface FavoriteButtonProps {
  character: Character;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function FavoriteButton({
  character,
  className,
  onClick,
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavoritesContext();
  const isFav = isFavorite(character.id) ?? false;

  return (
    <button
      className={`box-content transition duration-500 hover:scale-120 hover:drop-shadow-[0_0_3px_#fff] ${className ?? ''}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={async (e) => {
        onClick?.(e);
        await toggleFavorite(character);
      }}
    >
      {isFav ? (
        <HeartIcon
          aria-hidden="true"
          data-testid="is-favorite-icon"
          className="h-full text-marvel-red transition duration-500 group-hover:text-white"
        />
      ) : (
        <ChunkyHeartIcon
          aria-hidden="true"
          data-testid="is-not-favorite-icon"
          className="h-full text-white transition duration-500"
        />
      )}
    </button>
  );
}
