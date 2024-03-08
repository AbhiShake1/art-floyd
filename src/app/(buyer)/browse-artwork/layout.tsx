import { ArtworkSearchBar } from "./_components/artwork-search-bar";

export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="relative w-full pt-36">
    <div className="absolute top-20 right-10 w-96 flex flex-row space-x-3 justify-end items-center">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
				<ArtworkSearchBar />
      </div>
    </div>
    {children}
  </div>
}
