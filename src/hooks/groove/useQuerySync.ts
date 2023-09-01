// import { useEffect } from 'react';
//
// import {
//   setGrooveFromStringAction,
//   setTitleAction,
//   useMetronomeContext,
// } from '../../context/MetronomeContext';
// import { createStringGroove } from '../../utils/shirtify';
// import { getQuery, modifyQuery, updateQuery } from '../../utils/url';
//
// export function useQuerySync() {
//   const { groove, dispatch } = useMetronomeContext();
//
//   // set groove from query
//   useEffect(() => {
//     const queryParams = getQuery();
//     dispatch(setGrooveFromStringAction(queryParams.g));
//
//     const titleStr = queryParams.title || '';
//     if (titleStr) {
//       document.title = 'Groove - ' + titleStr;
//       dispatch(setTitleAction(titleStr));
//     }
//   }, [dispatch]);
//
//   // update query
//   useEffect(() => {
//     if (groove.bars.length) {
//       const qs = modifyQuery({
//         g: createStringGroove(groove),
//         ...(groove.title ? { title: groove.title } : {}),
//       });
//       updateQuery(qs);
//     }
//   }, [groove]);
// }
