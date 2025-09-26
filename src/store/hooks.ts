import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";

// useDispatch va useSelector uchun maxsus hooklar
export const useAppDispatch = () => useDispatch<AppDispatch>();

// userSelector uchun maxsus hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
