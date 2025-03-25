import { HeartIcon } from '@/components/shared/icons/HeartIcon';
import { useFavoritesContext } from '@/contexts/favorites/useFavoritesContext';
import { QUERY_PARAMS } from '@/services/types';
import { useNavigate, useSearchParams } from 'react-router';

export function FavoritesCounter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { favoritesCount } = useFavoritesContext();

  return (
    <button
      className="flex items-center gap-2 p-2 text-white"
      data-testid="favorites-counter"
      aria-label="Go to favorites"
      onClick={() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(QUERY_PARAMS.SHOW_FAVORITES, 'true');
        navigate(`/?${newSearchParams.toString()}`);
      }}
    >
      <HeartIcon className="h-6 w-6 text-marvel-red" /> {favoritesCount}
    </button>
  );
}
