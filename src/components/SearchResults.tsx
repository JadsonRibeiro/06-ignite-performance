import { useMemo } from "react";
import { List, ListRowRenderer, AutoSizer } from "react-virtualized";
import { ProductItem } from "./ProductItem";

interface SearchResultsProps {
  results: Array<{
    id: number;
    price: number;
    title: string;
  }>;
  onAddToWishList: (id: number) => void;
}

export function SearchResults({ results, onAddToWishList }: SearchResultsProps) {
  /**
   * Sugestão para performance!
   * 
   * Em vez de pôr esse calculo aqui, é melhor colocá-lo quando os dados são obtidos (index.tsx/handleSearch).
   * Dessa forma, o cálculo não precisará ser refeito sempre que o componente for renderizado, mas será feito
   * apenas quando os dados forem obtidos (no caso, quando um submit for feito).
   * 
   * Isso se aplica também a formatação de dados (de preço, por exemplo)
   * 
   * Em suma, eviter pôr funcionalidades que exijam processamento no meio de um componente. Ponha dentro
   * de funcoes que sejam disparadas em momentos específicos e não onde ela será reprocessada só porque
   * o compomente foi renderizado.
   */
  const totalPrice = useMemo(() => {
    return results.reduce((total, product) => {
      return total + product.price;
    }, 0)
  }, [results]);

  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    return (
      <div key={key} style={style}>
        <ProductItem 
            product={results[index]} 
            onAddToWishList={onAddToWishList}
          />
      </div>
    )
  }

  return (
    <div>
      <h2>{totalPrice}</h2>

      <div style={{height: '70vh'}}>
        <AutoSizer>
          {({ width, height }) => (
            <List 
              height={height}
              rowHeight={30}
              width={width}
              overscanRowCount={5}
              rowCount={results.length}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

/**
 * useMemo
 * 
 * Propósito: evitar que alguma coisa que exija muito processamento seja refeito sempre que o componente
 * for renderizado.
 * 
 * Quando utiliza-lo?
 * 
 * 1 - Cálculos pesados
 * 2 - Quando um valor gerado é repassado para um componente filho
 *    Quando um valor gerado no componente pai é repassado para um componente filho, o React sempre
 *    criará um novo valor na memória quando o componente for renderizado. Se usar o useMemo isso
 *    não acontecerá pois o realizar o algorítmo de reconciliação, o React notará que os valores 
 *    são os mesmos pois ocupam o mesmo espaço na memória (igualdade referencial)
 */ 
