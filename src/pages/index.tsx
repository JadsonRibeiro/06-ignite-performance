import { FormEvent, useCallback, useState } from "react";
import { SearchResults } from "../components/SearchResults";

export default function Home() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const addToWishList = useCallback((id: number) => {
    console.log(id);
  }, []);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();

    if(!search.trim()) {
      return;
    }

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    setResults(data);
  }

  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <SearchResults 
        results={results} 
        onAddToWishList={addToWishList}
      />
    </div>
  )
}

/**
 * useCallback
 * 
 * Propósito: Ao re-renderizar um componente o React fará a comparação de suas propriedades para avaliar
 * se recria ou não. Nessas propriedades estão inclusas as funções (por exemplo, addToWishList). Caso
 * não seja utilizado o useCallback, essas funções serão recriadas, ocuparão um novo espaço na memória
 * e por isso, quando for feita o algoritimo de reconciliação, as propriedades divergirão e o componente
 * será renderizado novamente. Ao utilizar o useCallback, quando o componente for recriado, as funcoes
 * nao serão recriadas e continuarão oculpando o mesmo espaco na memoria. A chave do entendimento é a
 * igualdade referencial.
 * 
 * Quando utilizar?
 * 
 * 1 - Prop Drilling - quando uma funcão é repassada para componentes filhos
 * 2 - Contextos - uma mesma funcão é utilizado em vários componentes
 */
