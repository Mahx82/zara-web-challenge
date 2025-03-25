import { Link } from 'react-router';
import { FavoriteButton } from '@/components/shared/FavoriteButton';

interface CharacterListProps {
  children: React.ReactElement[];
}

export function CharacterList({ children }: CharacterListProps) {
  return (
    <ul className="grid [grid-template-columns:repeat(auto-fill,minmax(173px,1fr))] gap-4">
      {children}
    </ul>
  );
}

interface CardProps {
  name: string;
  image: string;
  id: number;
}

function Card(props: CardProps) {
  const { id, image, name } = props;

  return (
    <li className="group flex flex-col" data-testid="character-card">
      <Link to={id.toString()} className="flex flex-grow flex-col">
        <div className="h-[190px] overflow-hidden">
          <img src={image} alt={name} />
        </div>
        <div className="relative flex-grow bg-black px-4 pt-5 pb-4 card-mask before:absolute before:top-0 before:left-0 before:-z-1 before:h-1.5 before:w-full before:bg-marvel-red before:transition-all before:duration-500 before:ease-in-out group-hover:before:h-full group-hover:before:max-h-full">
          <div className="flex items-start justify-between">
            <p className="text-sm text-white uppercase">{name}</p>
            <FavoriteButton
              className="mt-[-4px] mr-[-8px] h-3 p-2 text-white"
              character={props}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          </div>
        </div>
      </Link>
    </li>
  );
}

CharacterList.Card = Card;
