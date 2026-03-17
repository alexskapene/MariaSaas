import { RootState } from "@renderer/app/store/store";
import { useSelector } from "react-redux";



export const useCurrency = () => {
    const { currency, exchangeRate } = useSelector((state: RootState) => state.session);

    const formatPrice = (amountInCDF: number) => {
        if (currency === 'CDF') {
            return { value: amountInCDF, symbol: 'CDF' };
        } else {
            // Conversion en USD
            const val = amountInCDF / exchangeRate;
            return {
                value: Number(val.toFixed(2)), // Arrondi à 2 décimales
                symbol: '$'
            }
        }
    }
    return { currency, exchangeRate, formatPrice };
}