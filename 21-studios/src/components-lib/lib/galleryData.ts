export interface GalleryImage {
  id: number; src: string; alt: string
  category: string; title: string
  width: number; height: number
}

export const categories = ['All','Wedding','Portrait','Editorial','Commercial','Event']

export const images: GalleryImage[] = [
  { id:1,  src:'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1800&auto=format&fit=crop', alt:'Wedding ceremony',        category:'Wedding',    title:'Amara & Elijah',     width:1800, height:2400 },
  { id:2,  src:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop', alt:'Wedding reception',       category:'Wedding',    title:'Celebration at Dusk', width:1800, height:1200 },
  { id:3,  src:'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop', alt:'Bride and groom',         category:'Wedding',    title:'Sofia & James',      width:1800, height:2700 },
  { id:4,  src:'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=80&w=1800&auto=format&fit=crop', alt:'Wedding bouquet',         category:'Wedding',    title:'Floral Details',     width:1800, height:2250 },
  { id:5,  src:'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1800&auto=format&fit=crop', alt:'Bride walking',           category:'Wedding',    title:'Grand Entrance',     width:1800, height:1200 },
  { id:6,  src:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1800&auto=format&fit=crop', alt:'Portrait golden light',   category:'Portrait',   title:'Golden Glow',        width:1800, height:2250 },
  { id:7,  src:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1800&auto=format&fit=crop', alt:'Male studio portrait',    category:'Portrait',   title:'Studio Session',     width:1800, height:2250 },
  { id:8,  src:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1800&auto=format&fit=crop', alt:'Outdoor portrait',        category:'Portrait',   title:'Natural Light',      width:1800, height:2250 },
  { id:9,  src:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1800&auto=format&fit=crop', alt:'Landscape editorial',     category:'Editorial',  title:'Soleil Campaign',    width:1800, height:1200 },
  { id:10, src:'https://images.unsplash.com/photo-1537795479-cf48d1bf9a9c?q=80&w=1800&auto=format&fit=crop',   alt:'Fashion editorial',       category:'Editorial',  title:'Azure Series',       width:1800, height:1200 },
  { id:11, src:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800&auto=format&fit=crop', alt:'Fashion model',           category:'Editorial',  title:'Vogue Series',       width:1800, height:2250 },
  { id:12, src:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1800&auto=format&fit=crop', alt:'Commercial shoot',        category:'Commercial', title:'Retail Campaign',    width:1800, height:1200 },
  { id:13, src:'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1800&auto=format&fit=crop', alt:'Brand photography',       category:'Commercial', title:'Brand Identity',     width:1800, height:1200 },
  { id:14, src:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1800&auto=format&fit=crop', alt:'Corporate event',         category:'Event',      title:'Corporate Summit',   width:1800, height:1200 },
  { id:15, src:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1800&auto=format&fit=crop', alt:'Gala evening',            category:'Event',      title:'Gala Evening',       width:1800, height:1200 },
]
