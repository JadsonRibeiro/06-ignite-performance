import { memo, useState } from "react"
import dinamyc from "next/dynamic"
import { AddProductToWishlistProps } from "./AddProductToWishlist";

const AddProductToWishlist = dinamyc<AddProductToWishlistProps>(() => {
  return import('./AddProductToWishlist').then(mod => mod.AddProductToWishlist);
}, {
  // eslint-disable-next-line react/display-name
  loading: () => <span>Carregando...</span>
});

interface ProductItemProps {
  product: {
    id: number;
    price: number;
    title: string;
  };
  onAddToWishList: (id: number) => void;
}

function ProductItemComponent({ product, onAddToWishList }: ProductItemProps) {
  const [isAddingProductToWishlist, setIsAddingProductToWishlist] = useState(false);

  return (
    <div>
      {product.title} - <strong>{product.price}</strong>

      <button onClick={() => setIsAddingProductToWishlist(true)}>Add to wish list?</button>

      { isAddingProductToWishlist && (
        <AddProductToWishlist 
          onAddToWishlist={() => {
            onAddToWishList(product.id) 
            setIsAddingProductToWishlist(false)
          }}
          onRequestClose={() => setIsAddingProductToWishlist(false)}
        />
      ) }
    </div>
  )
}

/**
 * Sem o segundo parâmetro, o memo fará sua própria comparação das propriedades.
 * A comparacao feita pelo memo é uma comparação rasa e como a principal propriedade 
 * é um objeto o resultado sempre será false, pois ao comparar objetos, o js verificará 
 * se os objetos ocupam o mesmo espaço na memória, assim o componente sempre será re-renderizado. 
 */ 

export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.product, nextProps.product);
});

/**
 * Comportamento padrão do React
 * 
 * 1 - Cria uma nova versão do component
 * 2 - Verifica se há alterações
 * 3 - Se houver alterações, renderiza
 */ 

/**
 * Nem sempre é viável utilizar o memo pois há um custo em fazer a verificação no memo.
 * Em determinadas situações é melhor deixar o comportamento padrão do React.
 * 
 * Em quais situações utilizar o memo?
 * 
 * 1 - Pure functional components - Funcoes puras são funcoes que, dados os mesmos paramentros,
 *    o resultado será o mesmo. Na prática, esses são componentes que são criados apenas para organizar
 *    o layout, não para adicionar uma funcionalidade.
 * 2 - Componentes que renderizam demais
 * 3 - Componentes que renderizam com as mesmas props
 * 4 - Componentes que são de tamanho médio ou grande. Não há grande ganho em componentes pequenos.
 */ 