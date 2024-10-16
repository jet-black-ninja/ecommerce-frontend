import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionMap, categoryOptionsMap } from "@/config/config";
import { Badge } from "../ui/badge";
import { Product } from "@/interfaces/Product";
function ShoppingProductTile({
  handleGetProductDetails,
  product,
  handleAddToCart
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out of Stock
            </Badge>
          ) : product.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only${product.totalStock} items left !`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product.category]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-lg font-semibold text-primary ${product?.salePrice > 0 ? 'line-through' : ''}`}>
              {product.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">{product.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          {product?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Out Of Stock
            </Button>
          ) : (
            <Button
              onClick={() => handleAddToCart(product?._id, product?.totalStock)}
              className="w-full"
            >
              Add to cart
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  )
}

export default ShoppingProductTile;
