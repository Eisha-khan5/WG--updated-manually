
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import { motion } from 'framer-motion';

// const Brands = () => {
//   const brands = [
//     {
//       id: 'khaadi',
//       name: 'Khaadi',
//       description: 'Traditional Pakistani handwoven fabrics with contemporary designs',
//       category: 'Traditional Wear',
//       established: '1998',
//       imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop',
//       featured: true
//     },
//     {
//       id: 'gul-ahmed',
//       name: 'Gul Ahmed',
//       description: 'Premium textiles and fashion with elegant Pakistani aesthetics',
//       category: 'Luxury',
//       established: '1953',
//       imageUrl: 'https://images.unsplash.com/photo-1566479179817-c0c59c98e2f6?w=400&h=300&fit=crop',
//       featured: true
//     },
//     {
//       id: 'sana-safinaz',
//       name: 'Sana Safinaz',
//       description: 'High-end designer wear blending tradition with modern fashion',
//       category: 'Designer',
//       established: '1989',
//       imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
//       featured: false
//     },
//     {
//       id: 'maria-b',
//       name: 'Maria B',
//       description: 'Contemporary Pakistani fashion with intricate embroidery',
//       category: 'Designer',
//       established: '1999',
//       imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=400&h=300&fit=crop',
//       featured: false
//     },
//     {
//       id: 'alkaram',
//       name: 'Alkaram Studio',
//       description: 'Ready-to-wear and unstitched fabrics with vibrant prints',
//       category: 'Ready-to-Wear',
//       established: '1986',
//       imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
//       featured: false
//     },
//     {
//       id: 'elan',
//       name: 'Elan',
//       description: 'Luxury couture and prêt wear with sophisticated designs',
//       category: 'Luxury',
//       established: '2001',
//       imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
//       featured: true
//     },
//     {
//       id: 'nishat-linen',
//       name: 'Nishat Linen',
//       description: 'Quality fabrics and contemporary designs for everyday wear',
//       category: 'Ready-to-Wear',
//       established: '1992',
//       imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
//       featured: false
//     },
//     {
//       id: 'sapphire',
//       name: 'Sapphire',
//       description: 'Modern Pakistani fashion with artistic prints and designs',
//       category: 'Contemporary',
//       established: '2010',
//       imageUrl: 'https://images.unsplash.com/photo-1586495985984-b40c9a2a9b60?w=400&h=300&fit=crop',
//       featured: false
//     },
//     {
//       id: 'zellbury',
//       name: 'Zellbury',
//       description: 'Affordable fashion with trendy designs for modern women',
//       category: 'Contemporary',
//       established: '2010',
//       imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop',
//       featured: false
//     }
//   ];

//   const featuredBrands = brands.filter(brand => brand.featured);
//   const allBrands = brands;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
//       <Navbar />
      
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-br from-navy-700 via-navy-600 to-steel-600 text-white py-20">
//         <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center"
//           >
//             <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
//               Pakistani Fashion Brands
//             </h1>
//             <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
//               Discover the finest collection of authentic Pakistani clothing brands, 
//               from traditional handwoven fabrics to contemporary designer wear
//             </p>
//           </motion.div>
//         </div>
//       </div>

//       {/* Featured Brands Section */}
//       <div className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-700 mb-4">
//               Featured Brands
//             </h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Premium brands setting the standard for Pakistani fashion excellence
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {featuredBrands.map((brand, index) => (
//               <motion.div
//                 key={brand.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.1 * index }}
//               >
//                 <Link to={`/search?brand=${brand.id}`}>
//                   <Card className="group cursor-pointer h-full hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
//                     <div className="relative overflow-hidden">
//                       <img
//                         src={brand.imageUrl}
//                         alt={brand.name}
//                         className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
//                       <Badge className="absolute top-4 left-4 bg-emerald-500 hover:bg-emerald-600 text-white">
//                         Featured
//                       </Badge>
//                       <div className="absolute bottom-4 left-4 text-white">
//                         <h3 className="text-xl font-serif font-bold">{brand.name}</h3>
//                         <p className="text-sm text-white/80">Est. {brand.established}</p>
//                       </div>
//                     </div>
                    
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between mb-3">
//                         <Badge variant="secondary" className="text-xs">
//                           {brand.category}
//                         </Badge>
//                       </div>
//                       <p className="text-muted-foreground text-sm leading-relaxed">
//                         {brand.description}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* All Brands Section */}
//       <div className="py-16 bg-gradient-to-br from-muted/30 to-background">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-700 mb-4">
//               All Brands
//             </h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Explore our complete collection of authentic Pakistani fashion brands
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {allBrands.map((brand, index) => (
//               <motion.div
//                 key={brand.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.05 * index }}
//               >
//                 <Link to={`/search?brand=${brand.id}`}>
//                   <Card className="group cursor-pointer h-full hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-navy-200 bg-white/80 backdrop-blur-sm">
//                     <div className="relative overflow-hidden">
//                       <img
//                         src={brand.imageUrl}
//                         alt={brand.name}
//                         className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//                       {brand.featured && (
//                         <Badge className="absolute top-2 right-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
//                           Featured
//                         </Badge>
//                       )}
//                     </div>
                    
//                     <CardContent className="p-4">
//                       <h3 className="font-serif font-semibold text-navy-700 mb-1 group-hover:text-navy-600 transition-colors">
//                         {brand.name}
//                       </h3>
//                       <div className="flex items-center justify-between mb-2">
//                         <Badge variant="outline" className="text-xs border-navy-200 text-navy-600">
//                           {brand.category}
//                         </Badge>
//                         <span className="text-xs text-muted-foreground">Est. {brand.established}</span>
//                       </div>
//                       <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
//                         {brand.description}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Brands;
