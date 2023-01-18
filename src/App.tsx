import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import {Route} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import AppContext from './context';
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Favorites from "./pages/Favorites";


export const App: FC = () => {
    const [items, setItems] = useState<ItemsType[]>([]);
    const [cartItems, setCartItems] = useState<CartType[]>([]);
    const [favorites, setFavorites] = useState<FavoritesType[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [cartOpened, setCartOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


//https://63c597eee1292e5bea270389.mockapi.io/items

    //https://63c597eee1292e5bea270389.mockapi.io/cart

    // https://6369227915219b8496105d27.mockapi.io/favorites

    useEffect(() => {
        async function fetchData() {
            try {
                const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
                    axios.get<CartType[]>('https://63c597eee1292e5bea270389.mockapi.io/cart'),
                    axios.get<FavoritesType[]>('https://6369227915219b8496105d27.mockapi.io/favorites'),
                    axios.get<ItemsType[]>('https://63c597eee1292e5bea270389.mockapi.io/items'),
                ]);

                setIsLoading(false);
                setCartItems(cartResponse.data);
                setFavorites(favoritesResponse.data);
                setItems(itemsResponse.data);
            } catch (error) {
                alert('Ошибка при запросе данных ;(');
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const onAddToCart = async (obj: CartType) => {
        console.log(obj)
        try {
            const findItem = cartItems.find((item) => Number(item.id) === Number(obj.id));
            if (findItem) {
                setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
                await axios.delete<CartType[]>(`https://63c597eee1292e5bea270389.mockapi.io/cart/${findItem.id}`);
            } else {
                setCartItems((prev) => [...prev, obj]);
                const {data} = await axios.post('https://63c597eee1292e5bea270389.mockapi.io/cart', obj);
                setCartItems((prev) =>
                    prev.map((item) => {
                        if (item.id === data.parentId) {
                            return {
                                ...item,
                                id: data.id,
                            };
                        }
                        return item;
                    }),
                );
            }
        } catch (error) {
            alert('Ошибка при добавлении в корзину');
            console.error(error);
        }
    };

    const onRemoveItem = (id: string) => {
        try {
            axios.delete(`https://63c597eee1292e5bea270389.mockapi.io/cart/${id}`);
            setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
        } catch (error) {
            alert('Ошибка при удалении из корзины');
            console.error(error);
        }
    };

    const onAddToFavorite = async (obj: FavoritesType) => {
        try {
            if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
                await axios.delete(`https://6369227915219b8496105d27.mockapi.io/favorites/${obj.id}`);
                setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
            } else {
                const {data} = await axios.post(
                    'https://6369227915219b8496105d27.mockapi.io/favorites',
                    obj,
                );
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert('Не удалось добавить в фавориты');
            console.error(error);
        }
    };

    const onChangeSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const isItemAdded = (id: string): boolean => {
        return cartItems.some((obj) => Number(obj.id) === Number(id));
    };

    const value: IContextValue = {
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
    }

    return (
        <AppContext.Provider
            value={value}>
            <div className="wrapper clear">
                <Drawer
                    items={cartItems}
                    onClose={() => setCartOpened(false)}
                    onRemove={onRemoveItem}
                    opened={cartOpened}
                />

                <Header onClickCart={() => setCartOpened(true)}/>

                <Route path="" exact>
                    <Home
                        items={items}
                        cartItems={cartItems}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        onChangeSearchInput={onChangeSearchInput}
                        onAddToFavorite={onAddToFavorite}
                        onAddToCart={onAddToCart}
                        isLoading={isLoading}
                    />
                </Route>

                <Route path="favorites" exact>
                    <Favorites/>
                </Route>

                <Route path="orders" exact>
                    <Orders/>
                </Route>
            </div>
        </AppContext.Provider>
    );
}


export interface CartType {
    createdAt?: string;
    name?: string;
    avatar?: string;
    id: string;
    title: string;
    imageUrl: string;
    price: number;
}

export interface ItemsType {
    title: string;
    price: number;
    imageUrl: string;
    id: string
}

export interface FavoritesType {
    createdAt?: string;
    name?: string;
    avatar?: string;
    id: string;
    title: string;
    imageUrl: string;
    price: number;
}

export interface IContextValue {
    items: ItemsType[]
    cartItems: CartType[]
    favorites: FavoritesType[]
    isItemAdded: (id: string) => boolean
    onAddToFavorite: (obj: FavoritesType) => void
    onAddToCart: (obj: CartType) => void
    setCartOpened: (s: boolean) => void
    setCartItems: (obj: CartType[]) => void
}