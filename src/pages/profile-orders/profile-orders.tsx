import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getUserOrders,
  selectLoginUserRequest,
  selectUserOrders
} from '../../services/slices/userSlice';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectLoginUserRequest);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);
  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
