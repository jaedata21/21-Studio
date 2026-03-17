export interface GalleryImage { id: number; src: string; alt: string; category: string; title: string; width: number; height: number }
export const categories = ['All','Wedding','Portrait','Editorial','Commercial','Event']
export const images: GalleryImage[] = [
  { id:1, src:'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1800&auto=format&fit=crop', alt:'Wedding ceremony', category:'Wedding', title:'Amara & Elijah', width:1800, height:2400 },
  { id:2, src:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop', alt:'Wedding reception', category:'Wedding', title:'Celebration at Dusk', width:1800, height:1200 },
  { id:3, src:'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop', alt:'Bride and groom', category:'Wedding', title:'Sofia & James', width:1800, height:2700 },
  { id:4, src:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1800&auto=format&fit=crop', alt:'Portrait golden light', category:'Portrait', title:'Golden Glow', width:1800, height:2250 },
  { id:5, src:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1800&auto=format&fit=crop', alt:'Male studio portrait', category:'Portrait', title:'Studio Session', width:1800, height:2250 },
  { id:6, src:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1800&auto=format&fit=crop', alt:'Landscape editorial', category:'Editorial', title:'Soleil Campaign', width:1800, height:1200 },
  { id:7, src:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800&auto=format&fit=crop', alt:'Fashion model', category:'Editorial', title:'Vogue Series', width:1800, height:2250 },
  { id:8, src:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1800&auto=format&fit=crop', alt:'Commercial shoot', category:'Commercial', title:'Retail Campaign', width:1800, height:1200 },
  { id:9, src:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1800&auto=format&fit=crop', alt:'Corporate event', category:'Event', title:'Corporate Summit', width:1800, height:1200 },
]