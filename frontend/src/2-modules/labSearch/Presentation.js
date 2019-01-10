import React from 'react'
import ExpanderIcons from '../utilities/ExpanderIcons'
import Results from './Results'
import Filters from './Filters'
import DotLoader from '../utilities/animations/DotLoader'
import {
  Canvas,
  LeftPanel,
  SearchPanel,
  ResultsPanel,
  MainPanel
} from '../../1-layouts/SearchPage'
import SearchBar from '../user/individual/dashboard/SearchBar'

export default function (props) {
  let { filters, handleFilterClick, ...search } = props
  return (
    <Canvas>
      <LeftPanel>
        <Filters filters={filters} handleFilterClick={handleFilterClick} />
      </LeftPanel>
      <MainPanel>
        <SearchPanel>
          <SearchBar {...search} />
        </SearchPanel>
        <ResultsPanel>
          <Results {...search} />
        </ResultsPanel>
      </MainPanel>
    </Canvas>
  )
}


// function SearchBody ({
//   all_labs,
//   next,
//   search,
//   executeSearch,
//   moreLabs,
//   updateSearch,
//   loading
// }) {
//   let labs_shown = all_labs.length
//   let labs_left = next.length
//   let total_labs = labs_shown + labs_left
//   return (
//     <div id='search_results'>
//       <input
//         onKeyUp={updateSearch}
//         type='text'
//         placeholder='keywords'
//         onKeyPress={executeSearch}
//       />
//       <aside>
//         Groups 1-{labs_shown} ({total_labs} total) for <b>{search}</b>
//       </aside>
//       <main>
//         {!loading && all_labs.map(r => r)}
//         {loading && <DotLoader />}
//       </main>
//       {labs_left > 0 && (
//         <button id='lab-srch-more' onClick={moreLabs.bind(this)}>
//           Mo' labs, mo' problems
//         </button>
//       )}
//     </div>
//   )
// }

// function SearchSideBar ({
//   filterTypes,
//   filterFriendlyNames,
//   filterContentArr,
//   expand
// }) {
//   return (
//     <aside className='search-sidebar'>
//       {filterTypes.map((type, idx) => {
//         return (
//           <div className='filter_type'>
//             <div
//               key={`${type}-filter`}
//               id={`${type}-filter`}
//               className='search-filter-container'
//             >
//               <div className='search-filter-title'>
//                 {filterFriendlyNames[idx]}
//               </div>
//               <ExpanderIcons
//                 id={`${type}-filter`}
//                 classBase='search-filter-container'
//                 action={() => expand(type)}
//                 preClick={type === 'researchAreas'}
//                 filterDropdown
//               />
//               <hr className='filter-hr' />
//               {filterContentArr[idx]}
//             </div>
//           </div>
//         )
//       })}
//     </aside>
//   )
// }