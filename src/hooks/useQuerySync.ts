// import { useEffect } from 'react'
// import { useShallow } from 'zustand/react/shallow'
//
// import { useMetronomeStore } from '../store/useMetronomeStore'
// import { getQuery, modifyQuery, updateQuery } from '../utils/url'
//
// const getSettings = (str: string) => {
//   const [tempo, beats, subdivision, notes] = str.split(':').map(Number)
//
//   if ([tempo, beats, subdivision, notes].every((n) => !Number.isNaN(n))) {
//     if (notes.toString().length === beats * subdivision) {
//       return { tempo, beats, subdivision, notes }
//     }
//   }
//
//   return null
// }
//
// export function useQuerySync() {
//   const {
//     isTraining,
//     isPlaying,
//     beats,
//     subdivision,
//     tempo,
//     setBeatsAction,
//     setSubdivisionAction,
//     setTempoAction,
//   } = useMetronomeStore(
//     useShallow(
//       ({
//         beats,
//         subdivision,
//         tempo,
//         isTraining,
//         isPlaying,
//         setBeatsAction,
//         setSubdivisionAction,
//         setTempoAction,
//       }) => ({
//         isTraining,
//         isPlaying,
//         beats,
//         subdivision,
//         tempo,
//         setBeatsAction,
//         setSubdivisionAction,
//         setTempoAction,
//       }),
//     ),
//   )
//
//   // Set from query
//   useEffect(() => {
//     const queryParams = getQuery()
//
//     const settings = getSettings(queryParams.s)
//
//     if (settings) {
//     }
//
//     const titleStr = queryParams.title || ''
//     if (titleStr) {
//       document.title = 'Groove - ' + titleStr
//       dispatch(setTitleAction(titleStr))
//     }
//   }, [])
//
//   // Update query
//   useEffect(() => {
//     if (groove.bars.length) {
//       const qs = modifyQuery({
//         g: createStringGroove(groove),
//         ...(groove.title ? { title: groove.title } : {}),
//       })
//       updateQuery(qs)
//     }
//   }, [groove])
// }
