import React, {useContext} from 'react';
import Card from '../components/Card';
import AppContext from '../context';
import {FavoritesType} from "../App";

function Favorites() {
    // @ts-ignore
    const { favorites, onAddToFavorite } = useContext<FavoritesType>(AppContext);

    return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои закладки</h1>
      </div>

      <div className="d-flex flex-wrap">
        {favorites.map((item: FavoritesType) => (
          <Card key={item.id} favorited={true} onFavorite={onAddToFavorite} {...item}/>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
