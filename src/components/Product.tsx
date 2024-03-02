import {IProduct} from "../types.ts";

interface ProductPropTypes {
    item: IProduct
    idx?: number
}

export const Product = ({item}: ProductPropTypes) => {
    return (
        <div className="product" key={item.id}>
            {/*<strong>idx: {idx + 1}</strong>*/}
            <div className="product-id">{item.id}</div>
            <div>{item.brand}</div>
            <div className="product-prod">{item.product}</div>
            <div className="product-price">{item.price}</div>
        </div>
    )
}


