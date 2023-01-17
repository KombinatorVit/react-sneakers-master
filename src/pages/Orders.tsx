import React, {useContext, useEffect} from 'react';
import axios from 'axios';

import Card from '../components/Card';
import AppContext from '../context';

function Orders() {
  // @ts-ignore
  const { onAddToFavorite, onAddToCart } = useContext(AppContext);
  const [orders, setOrders] = React.useState<OrdersType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);



  // https://63c5b88bf80fabd877eed264.mockapi.io/orders

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('https://63c5b88bf80fabd877eed264.mockapi.io/orders');
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      } catch (error) {
        alert('Ошибка при запросе заказов');
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>

      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card key={index} loading={isLoading} {...item} />
        ))}
      </div>
    </div>
  );
}


export interface OrdersType {
  createdAt: string;
  name: string;
  avatar: string;
  id: string;
}
export default Orders;
