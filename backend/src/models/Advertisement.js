

// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useContext,
//   useCallback,
//   useMemo,
// } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import API from "../api/api";

// const API_KEY = "ashu@rodio";
// import {
//   Search,
//   MapPin,
//   Briefcase,
//   Filter,
//   X,
//   Truck,
//   Phone,
//   CheckCircle2,
//   Globe,
//   RotateCcw,
//   Star,
//   CircleDot,
//   User as UserIcon,
//   Building2,
//   MessageCircle,
//   ThumbsUp,
//   Flame,
// } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";
// import DirectoryMarquee from "./DirectoryMarquee";

// // ==========================================
// // 1. LOCATION SEARCH INPUT (Debounced & Clean)
// // ==========================================
// const LocationSearchInput = ({
//   placeholder,
//   selectedValue,
//   onSelectLocation,
// }) => {
//   const [searchTerm, setSearchTerm] = useState(selectedValue || "");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);



//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     setSearchTerm(selectedValue || "");
//   }, [selectedValue]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchTerm.trim().length >= 2) {
//         setLoading(true);
//         API.get(
//           `/location/search?query=${encodeURIComponent(searchTerm.trim())}`,
//           {
//             headers: { "x-api-key": API_KEY },
//           }
//         )
//           .then((res) => {
//             if (res.data && res.data.success) {
//               setSuggestions(res.data.data || []);
//               setIsOpen(true);
//             }
//           })
//           .catch((err) => console.error("Location Error:", err))
//           .finally(() => setLoading(false));
//       } else {
//         setSuggestions([]);
//         setIsOpen(false);
//       }
//     }, 250);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const handleSelect = (item) => {
//     setSearchTerm(item.name);
//     setIsOpen(false);
//     onSelectLocation(item);
//   };

//   const handleClear = () => {
//     setSearchTerm("");
//     setSuggestions([]);
//     setIsOpen(false);
//     onSelectLocation(null);
//   };

//   return (
//     <div ref={dropdownRef} className="relative w-full">
//       <div className="relative flex items-center">
//         <input
//           type="text"
//           value={searchTerm}
//           placeholder={placeholder}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setTimeout(() => setIsFocused(false), 200)}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             if (!e.target.value) onSelectLocation(null);
//           }}
//           className={`w-full h-[48px] pl-4 pr-10 bg-gray-50/80 border ${
//             isFocused
//               ? "border-blue-500 ring-2 ring-blue-500/20 bg-white"
//               : "border-gray-200"
//           } rounded-2xl text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400`}
//         />

//         {searchTerm && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition p-1"
//           >
//             <X size={16} />
//           </button>
//         )}
//       </div>

//       {isOpen && (
//         <ul className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto z-[1000] p-1.5 custom-scrollbar">
//           {loading && suggestions.length === 0 ? (
//             <li className="px-4 py-3 text-xs sm:text-sm text-center text-gray-400">
//               Loading routes...
//             </li>
//           ) : suggestions.length === 0 ? (
//             <li className="px-4 py-3 text-xs sm:text-sm text-center text-gray-400">
//               No locations found
//             </li>
//           ) : (
//             suggestions.map((item, i) => (
//               <li
//                 key={item._id || i}
//                 onClick={() => handleSelect(item)}
//                 className="px-3.5 py-2.5 rounded-xl cursor-pointer hover:bg-blue-50/80 hover:text-blue-600 text-sm flex justify-between items-center transition"
//               >
//                 <div>
//                   <strong className="font-semibold text-gray-800">
//                     {item.name}
//                   </strong>
//                   {item.state && (
//                     <span className="text-gray-500 text-xs ml-1.5 font-normal">
//                       ({item.state})
//                     </span>
//                   )}
//                 </div>
//               </li>
//             ))
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// // ==========================================
// // 2. MAIN DIRECTORY COMPONENT
// // ==========================================
// const Directory = () => {
//   const navigate = useNavigate();
//    const { state, city, category: urlCategory } = useParams();
//   const { user } = useContext(AuthContext);
//   const isLoggedIn = !!user;
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [profileGalleries, setProfileGalleries] = useState({});

//   const [galleryIndexes, setGalleryIndexes] = useState({});

//   const slugify = (value = "") => {
//   return value
//     .toString()
//     .trim()
//     .toLowerCase()
//     .replace(/&/g, "and")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// };

//   // REFS FOR AUTO-SCROLL
//   const resultsRef = useRef(null);

//   // TOGGLE STATE: "location" OR "business"
//   const [searchMode, setSearchMode] = useState("location");

//   // FILTER STATES
//   // FILTER STATES
// const [selectedState, setSelectedState] = useState("");
// const [selectedCity, setSelectedCity] = useState("");
// const [category, setCategory] = useState("");
// const [searchBy, setSearchBy] = useState("firmName");
// const [searchValue, setSearchValue] = useState("");

// // URL SE FILTERS LOAD
// useEffect(() => {
//   if (!state && !city && !urlCategory) {
//     return;
//   }

//   setSelectedState(
//     state
//       ? state
//           .split("-")
//           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(" ")
//       : ""
//   );

//   setSelectedCity(
//     city
//       ? city
//           .split("-")
//           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(" ")
//       : ""
//   );

//   setCategory(
//     urlCategory
//       ? urlCategory.replace(/-/g, "_")
//       : ""
//   );
// }, [state, city, urlCategory]);

// // DIRECTORY DATA
// const [directoryData, setDirectoryData] = useState([]);
// const [loading, setLoading] = useState(false);

// // Load profile gallery only when the Directory API does not include it.
// useEffect(() => {
//   let cancelled = false;
//   const loadMissingGalleries = async () => {
//     const missingItems = directoryData.filter((item) => {
//       const gallery = item.gallery || item.profile?.gallery;
//       return (!Array.isArray(gallery) || gallery.length === 0) &&
//         item._id &&
//         !profileGalleries[item._id];
//     });
//     if (!missingItems.length) return;

//     const results = await Promise.allSettled(
//       missingItems.map(async (item) => {
//         const response = await API.get(`/transporters/${item._id}`);
//         const profile = response.data?.data;
//         const gallery = profile?.gallery || profile?.profile?.gallery || [];
//         return { id: item._id, gallery: Array.isArray(gallery) ? gallery.slice(0, 10) : [] };
//       })
//     );

//     if (cancelled) return;
//     setProfileGalleries((previous) => {
//       const next = { ...previous };
//       results.forEach((result) => {
//         if (result.status === "fulfilled") {
//           next[result.value.id] = result.value.gallery;
//         }
//       });
//       return next;
//     });
//   };

//   loadMissingGalleries();
//   return () => { cancelled = true; };
// }, [directoryData]);

//   const transportCategories = useMemo(
//     () => [
    
//   { label: "All Categories", value: "" },
//   { label: "User / Manufacturer / Trader / Shipper / Other", value: "user" },
//   { label: "Transporter (Service Provider)", value: "transporter" },
//   { label: "Broker", value: "broker" },
//   { label: "Fleet Owner", value: "fleet_owner" },
//   { label: "Truck Owner", value: "truck_owner" },
//   { label: "Logistics Company", value: "logistics_company" },
//   { label: "Warehouse", value: "warehouse" },
//   { label: "CHA Agent (Custom House Agent)", value: "cha_agent" },
//   { label: "Courier / Cargo Carrier", value: "courier" },
//   { label: "Bus Service", value: "bus_service" },
//   { label: "Travel & Taxi Service", value: "travel_taxi" },
//   { label: "Bus / Truck Body Builder", value: "truck_body_builder" },
//   { label: "RTO Agent", value: "rto_agent" },
//   { label: "Finance Company", value: "finance_company" },
//   { label: "Finance Agent", value: "finance_agent" },
//   { label: "Packers & Movers", value: "packers_and_movers" },
//   { label: "Insurance Company", value: "insurance_company" },
//   { label: "Car Carrier", value: "car_carrier" },
//   { label: "Mining Vehicle Supplier", value: "miningvehicle_supplier" },
//   { label: "Parts & Battery Supplier", value: "partstypesbettry_supplier" },
//   { label: "Mechanic & Service Center", value: "mechanic and service center" },
//   { label: "Bike Taxi Auto", value: "biketexiauto" },
//   { label: "C&F Agent", value: "candfagent" },
//   { label: "Commission Agent", value: "commission_agent" },
//   { label: "Others", value: "others" },
// ]
//   ,
//   );

//   // SCROLL RESTORATION LOGIC (Footer glitch resolved via manual history control)
//   useEffect(() => {
//     if ("scrollRestoration" in window.history) {
//       window.history.scrollRestoration = "manual";
//     }

//     if (!loading && directoryData.length > 0) {
//       const lastCardId = sessionStorage.getItem("lastViewedDirectoryCardId");

//       if (lastCardId) {
//         const timer = setTimeout(() => {
//           const element = document.getElementById(lastCardId);

//           if (element) {
//             const navbarHeight = 80;
//             const elementPosition = element.getBoundingClientRect().top;
//             const offsetPosition =
//               elementPosition + window.pageYOffset - navbarHeight;

//             window.scrollTo({
//               top: offsetPosition,
//               behavior: "instant",
//             });
//           }

//           sessionStorage.removeItem("lastViewedDirectoryCardId");
//         }, 150);

//         return () => clearTimeout(timer);
//       }
//     }
//   }, [loading, directoryData]);

//   // AUTO SCROLL TO RESULTS ON MOBILE SEARCH
//   const scrollToResults = () => {
//     if (window.innerWidth < 768 && resultsRef.current) {
//       setTimeout(() => {
//         const yOffset = -70;
//         const y =
//           resultsRef.current.getBoundingClientRect().top +
//           window.pageYOffset +
//           yOffset;
//         window.scrollTo({ top: y, behavior: "smooth" });
//       }, 100);
//     }
//   };

//   // UNIFIED FETCH FUNCTION
// const fetchDirectoryData = useCallback(async (filters = {}) => {
//   try {
//     setLoading(true);

//     const params = {};

//     if (filters.state) params.state = filters.state;
//     if (filters.city) params.city = filters.city;
//     if (filters.category) params.category = filters.category;

//    const response = await API.get("/directory", {
//   params,
//   headers: {
//     "x-api-key": API_KEY,
//   },
// });

//     if (response.data && response.data.success) {
//       setDirectoryData(response.data.data || []);
//     } else if (Array.isArray(response.data)) {
//       setDirectoryData(response.data);
//     } else {
//       setDirectoryData([]);
//     }
//   } catch (error) {
//     console.error("Directory Fetch Error:", error);
//     setDirectoryData([]);
//   } finally {
//     setLoading(false);
//   }
// }, []);

// // useEffect(() => {
// //   fetchDirectoryData({
// //     state: selectedState,
// //     city: selectedCity,
// //     category: category,
// //   });
// // }, [selectedState, selectedCity, category]);

//   // SEARCH BY LOCATION & CATEGORY
//   useEffect(() => {
//   const stateName = state
//     ? state
//         .split("-")
//         .map(
//           (word) =>
//             word.charAt(0).toUpperCase() + word.slice(1)
//         )
//         .join(" ")
//     : "";

//   const cityName = city
//     ? city
//         .split("-")
//         .map(
//           (word) =>
//             word.charAt(0).toUpperCase() + word.slice(1)
//         )
//         .join(" ")
//     : "";

//   const categoryValue = urlCategory
//     ? urlCategory.replace(/-/g, "_")
//     : "";

//   // URL ke filters UI me set karo
//   setSelectedState(stateName);
//   setSelectedCity(cityName);
//   setCategory(categoryValue);

//   // /directory par koi filter nahi hai
//   // isliye saara data aayega
//   fetchDirectoryData({
//     state: stateName,
//     city: cityName,
//     category: categoryValue,
//   });
// }, [state, city, urlCategory, fetchDirectoryData]);
// const handleLocationSearch = (e) => {
//   e.preventDefault();

//   const stateSlug = slugify(selectedState);
//   const citySlug = slugify(selectedCity);
//   const categorySlug = slugify(category);

//   let url = "/directory";

//   if (stateSlug) {
//     url += `/${stateSlug}`;
//   }

//   if (citySlug) {
//     url += `/${citySlug}`;
//   }

//   if (categorySlug) {
//     url += `/${categorySlug}`;
//   }

//   navigate(url);

//   scrollToResults();

//   fetchDirectoryData({
//     state: selectedState,
//     city: selectedCity,
//     category: category,
//   });
// };

//   // SEARCH BY FIRM / OWNER / NUMBER
//   const handleBusinessSearch = async (e) => {
//     e.preventDefault();
//     if (!searchValue.trim()) return;

//     scrollToResults();

//     try {
//       setLoading(true);
//       const response = await API.get("/businesses/search-by", {
//         params: {
//           searchBy,
//           searchValue: searchValue.trim(),
//         },
//         headers: { "x-api-key": API_KEY },
//       });

//       if (response.data?.success) {
//         setDirectoryData(response.data.data || []);
//       } else {
//         setDirectoryData([]);
//       }
//     } catch (error) {
//       console.error("Business Search Error:", error);
//       setDirectoryData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // RESET FILTERS
//   const handleResetFilters = () => {
//     setSelectedState("");
//     setSelectedCity("");
//     setCategory("");
//     setSearchBy("firmName");
//     setSearchValue("");

//     fetchDirectoryData({
//       state: "",
//       city: "",
//       category: "",
//     });
//   };

//   // PHONE NUMBER MASKING
//   const maskPhoneNumber = (number) => {
//     if (!number) return "Not Provided";
//     const str = String(number).trim();
//     if (str.length >= 10) {
//       return "XXXXXX" + str.slice(-4);
//     }
//     return "XXXXXXXXXX";
//   };

//   return (
//     <div className="w-full max-w-[1550px] mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 mb-16">
//       <DirectoryMarquee />

//       {/* ==========================================
//           SEARCH FILTERS BOX WITH SLIDING TOGGLE
//       ========================================== */}
//       <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-8 sm:mb-10">
//         {/* Header & Reset Button */}
//         <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6">
//           <div className="flex items-center gap-2.5">
//             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
//               <Filter size={20} className="sm:w-[22px] sm:h-[22px]" />
//             </div>
//             <div>
//               <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
//                 Find Transport Directory
//               </h2>
//               <p className="hidden sm:block text-[15px] text-gray-500">
//                 Filter verified transporters, brokers & routes across India
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleResetFilters}
//             className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition border border-gray-200 cursor-pointer shrink-0 active:scale-95"
//           >
//             <RotateCcw size={15} />
//             <span className="hidden sm:inline">Reset All</span>
//             <span className="sm:hidden">Reset</span>
//           </button>
//         </div>

//         {/* SLIDING SEGMENTED CONTROL */}
//         <div className="w-full max-w-lg mx-auto mb-6 sm:mb-8">
//           <div className="relative p-1 bg-gray-100/90 rounded-2xl flex items-center border border-gray-200/80">
//             {/* Tab 1 */}
//             <button
//               type="button"
//               onClick={() => setSearchMode("location")}
//               className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer select-none ${
//                 searchMode === "location"
//                   ? "text-blue-700"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <MapPin
//                 size={16}
//                 className={
//                   searchMode === "location" ? "text-blue-600" : "text-gray-400"
//                 }
//               />
//               <span>Location Search</span>
//               {searchMode === "location" && (
//                 <motion.div
//                   layoutId="activeSearchTab"
//                   transition={{ type: "spring", stiffness: 400, damping: 35 }}
//                   className="absolute inset-0 bg-white rounded-xl shadow-md border border-gray-100 -z-10"
//                 />
//               )}
//             </button>

//             {/* Tab 2 */}
//             <button
//               type="button"
//               onClick={() => setSearchMode("business")}
//               className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer select-none ${
//                 searchMode === "business"
//                   ? "text-purple-700"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Building2
//                 size={16}
//                 className={
//                   searchMode === "business"
//                     ? "text-purple-600"
//                     : "text-gray-400"
//                 }
//               />
//               <span>Firm / Owner No.</span>
//               {searchMode === "business" && (
//                 <motion.div
//                   layoutId="activeSearchTab"
//                   transition={{ type: "spring", stiffness: 400, damping: 35 }}
//                   className="absolute inset-0 bg-white rounded-xl shadow-md border border-gray-100 -z-10"
//                 />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* FORMS */}
//         <AnimatePresence mode="wait">
//           {searchMode === "location" ? (
//             <motion.form
//               key="location-form"
//               initial={{ opacity: 0, y: 6 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -6 }}
//               transition={{ duration: 0.2 }}
//               onSubmit={handleLocationSearch}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 items-end"
//             >
//               <div>
//                 <label className="text-[15px] font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
//                   <MapPin size={14} className="text-blue-600" />
//                   State
//                 </label>
//                 <LocationSearchInput
//                   placeholder="Search State..."
//                   selectedValue={selectedState}
//                   onSelectLocation={(loc) =>
//                     setSelectedState(loc ? loc.name : "")
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="text-[15px] font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
//                   <MapPin size={14} className="text-green-600" />
//                   City
//                 </label>
//                 <LocationSearchInput
//                   placeholder="Search City..."
//                   selectedValue={selectedCity}
//                   onSelectLocation={(loc) =>
//                     setSelectedCity(loc ? loc.name : "")
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="text-[15px] font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
//                   <Briefcase size={14} className="text-orange-500" />
//                   Category
//                 </label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full h-[48px] bg-gray-50/80 border border-gray-200 rounded-2xl px-4 text-sm text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition cursor-pointer"
//                 >
//                   {transportCategories.map((cat, index) => (
//                     <option key={index} value={cat.value}>
//                       {cat.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full h-[48px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition shadow-lg shadow-blue-500/25 cursor-pointer text-sm"
//               >
//                 <Search size={18} />
//                 Search Directory
//               </button>
//             </motion.form>
//           ) : (
//             <motion.form
//               key="business-form"
//               initial={{ opacity: 0, y: 6 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -6 }}
//               transition={{ duration: 0.2 }}
//               onSubmit={handleBusinessSearch}
//               className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 items-end"
//             >
//               <div>
//                 <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
//                   <CircleDot size={14} className="text-purple-600" />
//                   Select category (Firm/Owner/Number)
//                 </label>
//                 <select
//                   value={searchBy}
//                   onChange={(e) => setSearchBy(e.target.value)}
//                   className="w-full h-[48px] bg-gray-50/80 border border-gray-200 rounded-2xl px-4 text-sm text-gray-800 outline-none focus:border-purple-500 focus:bg-white transition cursor-pointer"
//                 >
//                   <option value="firmName">Firm Name</option>
//                   <option value="ownerName">Owner Name</option>
//                   <option value="phoneNumber">Phone Number</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
//                   <Search size={14} className="text-purple-600" />
//                   Search Keyword / Number
//                 </label>
//                 <input
//                   type={searchBy === "phoneNumber" ? "tel" : "text"}
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   placeholder={
//                     searchBy === "firmName"
//                       ? "Enter Firm Name..."
//                       : searchBy === "ownerName"
//                         ? "Enter Owner Name..."
//                         : "Enter Phone Number..."
//                   }
//                   className="w-full h-[48px] bg-gray-50/80 border border-gray-200 rounded-2xl px-4 text-sm text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition placeholder:text-gray-400"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full h-[48px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition shadow-lg shadow-purple-500/25 cursor-pointer text-sm"
//               >
//                 <Search size={18} />
//                 Search Business
//               </button>
//             </motion.form>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* ==========================================
//           DIRECTORY RESULT SECTION
//       ========================================== */}
//       <div ref={resultsRef} className="scroll-mt-24">
//         <div className="flex items-center justify-between mb-5 sm:mb-6">
//           <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
//             Directory Results
//             <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
//               {directoryData.length}{" "}
//               {directoryData.length === 1 ? "Partner" : "Partners"}
//             </span>
//           </h3>
//         </div>

//         {loading ? (
//           <div className="text-center py-24 sm:py-28 font-medium text-gray-500 animate-pulse">
//             Loading Directory Details...
//           </div>
//         ) : directoryData.length === 0 ? (
//           <div className="bg-white rounded-2xl p-10 sm:p-16 text-center text-gray-500 font-medium shadow-sm border border-gray-100">
//             No Transport Found matching your criteria.
//           </div>
//         ) : (
//           <div className="w-full space-y-6">
//             <div className="flex flex-col gap-4 sm:gap-5">
//               {directoryData.map((item, index) => {
//                 const displayPhone = isLoggedIn
//                   ? item.phoneNumber
//                   : maskPhoneNumber(item.phoneNumber);
//                 const formattedRole = item.role
//                   ? item.role.replace(/_/g, " ")
//                   : "Transport Services";
//                 const rating = Number(item.averageRating || 0).toFixed(1);
//                 const reviews = item.totalReviews || 0;
//                 const cardId = `directory-card-${item._id || index}`;
//                 const location = [item.address, item.city, item.state]
//                   .filter(Boolean)
//                   .join(", ");
//                 const phoneForLink = String(item.phoneNumber || "").replace(/[^0-9+]/g, "");
//                 const galleryImages = (
//                   item.gallery?.length
//                     ? item.gallery
//                     : item.profile?.gallery?.length
//                       ? item.profile.gallery
//                       : profileGalleries[item._id]?.length
//                         ? profileGalleries[item._id]
//                         : []
//                 ).filter((photo) => photo?.imageUrl).slice(0, 10);
//                 const galleryIndex = Math.min(galleryIndexes[item._id] || 0, Math.max(galleryImages.length - 1, 0));
//                 const currentGalleryImage = galleryImages[galleryIndex]?.imageUrl || item.photo;

//                 const openEnquiry = () => {
//                   sessionStorage.setItem("lastViewedDirectoryCardId", cardId);
//                   const targetUrl = `/dashboard/transporters/${item._id}`;
//                   if (!isLoggedIn) {
//                     sessionStorage.setItem("authRedirectUrl", targetUrl);
//                     navigate("/login", { state: { returnTo: targetUrl } });
//                     return;
//                   }
//                   navigate(targetUrl);
//                 };

//                 return (
//                   <motion.article
//                     key={item._id || index}
//                     id={cardId}
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
//                       <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden rounded-lg bg-gray-100">
//                         {currentGalleryImage ? (
//                           <img
//                             src={currentGalleryImage}
//                             alt={item.firmName || "Business gallery"}
//                             className="h-full w-full object-cover cursor-zoom-in"
//                             onClick={() => setSelectedImage(currentGalleryImage)}
//                             onError={(e) => {
//                               e.currentTarget.style.display = "none";
//                               if (e.currentTarget.nextElementSibling) {
//                                 e.currentTarget.nextElementSibling.style.display = "flex";
//                               }
//                             }}
//                           />
//                         ) : null}
//                         <div
//                           className={`h-full w-full items-center justify-center bg-blue-50 text-4xl font-bold text-blue-700 ${
//                             currentGalleryImage ? "hidden" : "flex"
//                           }`}
//                         >
//                           {(item.firmName || "B").charAt(0).toUpperCase()}
//                         </div>

//                         {galleryImages.length > 1 && (
//                           <>
//                             <button
//                               type="button"
//                               aria-label="Previous gallery photo"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setGalleryIndexes((prev) => ({
//                                   ...prev,
//                                   [item._id]: (galleryIndex - 1 + galleryImages.length) % galleryImages.length,
//                                 }));
//                               }}
//                               className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xl font-bold text-white hover:bg-black/80"
//                             >
//                               ‹
//                             </button>
//                             <button
//                               type="button"
//                               aria-label="Next gallery photo"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setGalleryIndexes((prev) => ({
//                                   ...prev,
//                                   [item._id]: (galleryIndex + 1) % galleryImages.length,
//                                 }));
//                               }}
//                               className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xl font-bold text-white hover:bg-black/80"
//                             >
//                               ›
//                             </button>
//                             <span className="absolute bottom-2 right-2 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">
//                               {galleryIndex + 1}/{galleryImages.length}
//                             </span>
//                           </>
//                         )}
//                       </div>

//                       <div className="min-w-0 flex-1 flex flex-col">
//                         <div className="flex items-start gap-2">
//                           <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-white">
//                             <ThumbsUp size={15} />
//                           </div>
//                           <h4 className="min-w-0 flex-1 truncate text-lg sm:text-[21px] font-semibold leading-7 text-gray-950">
//                             {item.firmName || "Unnamed Firm"}
//                           </h4>
//                           {item.isVerified && (
//                             <span className="hidden sm:inline-flex shrink-0 items-center gap-1 text-sm font-bold text-sky-600">
//                               <CheckCircle2 size={17} className="fill-sky-100" />
//                               Verified
//                             </span>
//                           )}
//                         </div>

//                         <div className="mt-2 flex flex-wrap items-center gap-2">
//                           <span className="inline-flex items-center rounded-md bg-green-700 px-2 py-1 text-sm font-extrabold text-white">
//                             {rating} ★
//                           </span>
//                           <span className="text-sm sm:text-base text-gray-500">
//                             {reviews} Ratings
//                           </span>
//                           {item.isVerified && (
//                             <span className="inline-flex sm:hidden items-center gap-1 text-xs font-bold text-sky-600">
//                               <CheckCircle2 size={14} /> Verified
//                             </span>
//                           )}
//                           <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs sm:text-sm font-semibold text-gray-800">
//                             <Flame size={14} className="fill-orange-400 text-orange-500" />
//                             Trending
//                           </span>
//                         </div>

//                         {!!location && (
//                           <div className="mt-3 flex items-start gap-2 text-sm sm:text-base text-gray-800">
//                             <MapPin size={19} className="mt-0.5 shrink-0 text-gray-800" />
//                             <span className="line-clamp-2">{location}</span>
//                           </div>
//                         )}

//                         <div className="mt-2">
//                           <span className="inline-flex max-w-full rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs sm:text-sm capitalize text-gray-800">
//                             {item.category
//                               ? String(item.category).replace(/_/g, " ")
//                               : formattedRole}
//                           </span>
//                         </div>

//                         {item.totalVehicles > 0 && (
//                           <p className="mt-2 text-xs sm:text-sm text-gray-600">
//                             <Truck size={14} className="mr-1 inline text-blue-600" />
//                             {item.totalVehicles} {item.totalVehicles === 1 ? "Vehicle" : "Vehicles"}
//                             {item.vehicleTypes?.length ? ` · ${item.vehicleTypes.join(", ")}` : ""}
//                           </p>
//                         )}

//                         <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 sm:mt-auto sm:pt-4">
//                           <a
//                             href={phoneForLink ? `tel:${phoneForLink}` : undefined}
//                             onClick={(e) => {
//                               sessionStorage.setItem("lastViewedDirectoryCardId", cardId);
//                               if (!isLoggedIn) {
//                                 e.preventDefault();
//                                 sessionStorage.setItem("authRedirectUrl", `/dashboard/transporters/${item._id}`);
//                                 navigate("/login", { state: { returnTo: `/dashboard/transporters/${item._id}` } });
//                               } else if (!phoneForLink) {
//                                 e.preventDefault();
//                               }
//                             }}
//                             className="inline-flex min-w-[125px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-green-800"
//                           >
//                             <Phone size={17} fill="currentColor" /> Call
//                           </a>

//                           <a
//                             href={phoneForLink ? `https://wa.me/${phoneForLink.replace(/\D/g, "")}` : undefined}
//                             target="_blank"
//                             rel="noreferrer"
//                             onClick={(e) => {
//                               if (!isLoggedIn) {
//                                 e.preventDefault();
//                                 sessionStorage.setItem("authRedirectUrl", `/dashboard/transporters/${item._id}`);
//                                 navigate("/login", { state: { returnTo: `/dashboard/transporters/${item._id}` } });
//                               } else if (!phoneForLink) {
//                                 e.preventDefault();
//                               }
//                             }}
//                             className="inline-flex min-w-[125px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm sm:text-base font-bold text-gray-900 hover:bg-gray-50"
//                           >
//                             <MessageCircle size={18} className="text-green-600" /> WhatsApp
//                           </a>

//                           <button
//                             type="button"
//                             onClick={openEnquiry}
//                             className="inline-flex min-w-[125px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-sky-700"
//                           >
//                             <UserIcon size={17} /> View Profile
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.article>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedImage && (
//         <div
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4"
//           onClick={() => setSelectedImage(null)}
//         >
//           <button
//             type="button"
//             onClick={() => setSelectedImage(null)}
//             className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-2xl font-bold text-gray-900"
//             aria-label="Close image"
//           >
//             ×
//           </button>
//           <img
//             src={selectedImage}
//             alt="Profile"
//             onClick={(e) => e.stopPropagation()}
//             className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Directory;





import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";

const API_KEY = "ashu@rodio";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  X,
  Truck,
  Phone,
  CheckCircle2,
  Globe,
  RotateCcw,
  Star,
  CircleDot,
  User as UserIcon,
  Building2,
  MessageCircle,
  ThumbsUp,
  Flame,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import DirectoryMarquee from "./DirectoryMarquee";

// ==========================================
// 1. LOCATION SEARCH INPUT (Debounced & Clean)
// ==========================================
const LocationSearchInput = ({
  placeholder,
  selectedValue,
  onSelectLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState(selectedValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);



  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchTerm(selectedValue || "");
  }, [selectedValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        setLoading(true);
        API.get(
          `/location/search?query=${encodeURIComponent(searchTerm.trim())}`,
          {
            headers: { "x-api-key": API_KEY },
          }
        )
          .then((res) => {
            if (res.data && res.data.success) {
              setSuggestions(res.data.data || []);
              setIsOpen(true);
            }
          })
          .catch((err) => console.error("Location Error:", err))
          .finally(() => setLoading(false));
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (item) => {
    setSearchTerm(item.name);
    setIsOpen(false);
    onSelectLocation(item);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
    onSelectLocation(null);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!e.target.value) onSelectLocation(null);
          }}
          className={`w-full h-[48px] pl-4 pr-10 bg-gray-50/80 border ${
            isFocused
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-white"
              : "border-gray-200"
          } rounded-2xl text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400`}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto z-[1000] p-1.5 custom-scrollbar">
          {loading && suggestions.length === 0 ? (
            <li className="px-4 py-3 text-xs sm:text-sm text-center text-gray-400">
              Loading routes...
            </li>
          ) : suggestions.length === 0 ? (
            <li className="px-4 py-3 text-xs sm:text-sm text-center text-gray-400">
              No locations found
            </li>
          ) : (
            suggestions.map((item, i) => (
              <li
                key={item._id || i}
                onClick={() => handleSelect(item)}
                className="px-3.5 py-2.5 rounded-xl cursor-pointer hover:bg-blue-50/80 hover:text-blue-600 text-sm flex justify-between items-center transition"
              >
                <div>
                  <strong className="font-semibold text-gray-800">
                    {item.name}
                  </strong>
                  {item.state && (
                    <span className="text-gray-500 text-xs ml-1.5 font-normal">
                      ({item.state})
                    </span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

// ==========================================
// 2. MAIN DIRECTORY COMPONENT
// ==========================================
const Directory = () => {
  const navigate = useNavigate();
   const { state, city, category: urlCategory } = useParams();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const [selectedImage, setSelectedImage] = useState(null);

  const slugify = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

  // REFS FOR AUTO-SCROLL
  const resultsRef = useRef(null);

  // TOGGLE STATE: "location" OR "business"
  const [searchMode, setSearchMode] = useState("location");

  // FILTER STATES
  // FILTER STATES
const [selectedState, setSelectedState] = useState("");
const [selectedCity, setSelectedCity] = useState("");
const [category, setCategory] = useState("");
const [searchBy, setSearchBy] = useState("firmName");
const [searchValue, setSearchValue] = useState("");

// URL SE FILTERS LOAD
useEffect(() => {
  if (!state && !city && !urlCategory) {
    return;
  }

  setSelectedState(
    state
      ? state
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : ""
  );

  setSelectedCity(
    city
      ? city
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : ""
  );

  setCategory(
    urlCategory
      ? urlCategory.replace(/-/g, "_")
      : ""
  );
}, [state, city, urlCategory]);

// DIRECTORY DATA
const [directoryData, setDirectoryData] = useState([]);
const [loading, setLoading] = useState(false);
const [galleryIndexes, setGalleryIndexes] = useState({});


  const transportCategories = useMemo(
    () => [
    
  { label: "All Categories", value: "" },
  { label: "User / Manufacturer / Trader / Shipper / Other", value: "user" },
  { label: "Transporter (Service Provider)", value: "transporter" },
  { label: "Broker", value: "broker" },
  { label: "Fleet Owner", value: "fleet_owner" },
  { label: "Truck Owner", value: "truck_owner" },
  { label: "Logistics Company", value: "logistics_company" },
  { label: "Warehouse", value: "warehouse" },
  { label: "CHA Agent (Custom House Agent)", value: "cha_agent" },
  { label: "Courier / Cargo Carrier", value: "courier" },
  { label: "Bus Service", value: "bus_service" },
  { label: "Travel & Taxi Service", value: "travel_taxi" },
  { label: "Bus / Truck Body Builder", value: "truck_body_builder" },
  { label: "RTO Agent", value: "rto_agent" },
  { label: "Finance Company", value: "finance_company" },
  { label: "Finance Agent", value: "finance_agent" },
  { label: "Packers & Movers", value: "packers_and_movers" },
  { label: "Insurance Company", value: "insurance_company" },
  { label: "Car Carrier", value: "car_carrier" },
  { label: "Mining Vehicle Supplier", value: "miningvehicle_supplier" },
  { label: "Parts & Battery Supplier", value: "partstypesbettry_supplier" },
  { label: "Mechanic & Service Center", value: "mechanic and service center" },
  { label: "Bike Taxi Auto", value: "biketexiauto" },
  { label: "C&F Agent", value: "candfagent" },
  { label: "Commission Agent", value: "commission_agent" },
  { label: "Others", value: "others" },
]
  ,
  );

  // SCROLL RESTORATION LOGIC (Footer glitch resolved via manual history control)
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (!loading && directoryData.length > 0) {
      const lastCardId = sessionStorage.getItem("lastViewedDirectoryCardId");

      if (lastCardId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(lastCardId);

          if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "instant",
            });
          }

          sessionStorage.removeItem("lastViewedDirectoryCardId");
        }, 150);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, directoryData]);

  // AUTO SCROLL TO RESULTS ON MOBILE SEARCH
  const scrollToResults = () => {
    if (window.innerWidth < 768 && resultsRef.current) {
      setTimeout(() => {
        const yOffset = -70;
        const y =
          resultsRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  };

  // UNIFIED FETCH FUNCTION
const fetchDirectoryData = useCallback(async (filters = {}) => {
  try {
    setLoading(true);

    const params = {};

    if (filters.state) params.state = filters.state;
    if (filters.city) params.city = filters.city;
    if (filters.category) params.category = filters.category;

   const response = await API.get("/directory", {
  params,
  headers: {
    "x-api-key": API_KEY,
  },
});

    if (response.data && response.data.success) {
      setDirectoryData(response.data.data || []);
    } else if (Array.isArray(response.data)) {
      setDirectoryData(response.data);
    } else {
      setDirectoryData([]);
    }
  } catch (error) {
    console.error("Directory Fetch Error:", error);
    setDirectoryData([]);
  } finally {
    setLoading(false);
  }
}, []);

// useEffect(() => {
//   fetchDirectoryData({
//     state: selectedState,
//     city: selectedCity,
//     category: category,
//   });
// }, [selectedState, selectedCity, category]);

  // SEARCH BY LOCATION & CATEGORY
  useEffect(() => {
  const stateName = state
    ? state
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ")
    : "";

  const cityName = city
    ? city
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ")
    : "";

  const categoryValue = urlCategory
    ? urlCategory.replace(/-/g, "_")
    : "";

  // URL ke filters UI me set karo
  setSelectedState(stateName);
  setSelectedCity(cityName);
  setCategory(categoryValue);

  // /directory par koi filter nahi hai
  // isliye saara data aayega
  fetchDirectoryData({
    state: stateName,
    city: cityName,
    category: categoryValue,
  });
}, [state, city, urlCategory, fetchDirectoryData]);
const handleLocationSearch = (e) => {
  e.preventDefault();

  const stateSlug = slugify(selectedState);
  const citySlug = slugify(selectedCity);
  const categorySlug = slugify(category);

  let url = "/directory";

  if (stateSlug) {
    url += `/${stateSlug}`;
  }

  if (citySlug) {
    url += `/${citySlug}`;
  }

  if (categorySlug) {
    url += `/${categorySlug}`;
  }

  navigate(url);

  scrollToResults();

  fetchDirectoryData({
    state: selectedState,
    city: selectedCity,
    category: category,
  });
};

  // SEARCH BY FIRM / OWNER / NUMBER
  const handleBusinessSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    scrollToResults();

    try {
      setLoading(true);
      const response = await API.get("/businesses/search-by", {
        params: {
          searchBy,
          searchValue: searchValue.trim(),
        },
        headers: { "x-api-key": API_KEY },
      });

      if (response.data?.success) {
        setDirectoryData(response.data.data || []);
      } else {
        setDirectoryData([]);
      }
    } catch (error) {
      console.error("Business Search Error:", error);
      setDirectoryData([]);
    } finally {
      setLoading(false);
    }
  };

  // RESET FILTERS
  const handleResetFilters = () => {
    setSelectedState("");
    setSelectedCity("");
    setCategory("");
    setSearchBy("firmName");
    setSearchValue("");

    fetchDirectoryData({
      state: "",
      city: "",
      category: "",
    });
  };

  // PHONE NUMBER MASKING
  const maskPhoneNumber = (number) => {
    if (!number) return "Not Provided";
    const str = String(number).trim();
    if (str.length >= 10) {
      return "XXXXXX" + str.slice(-4);
    }
    return "XXXXXXXXXX";
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 mb-16">
      <DirectoryMarquee />

      {/* ==========================================
          SEARCH FILTERS BOX WITH SLIDING TOGGLE
      ========================================== */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-8 sm:mb-10">
        {/* Header & Reset Button */}
        <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Filter size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                Find Transport Directory
              </h2>
              <p className="hidden sm:block text-[15px] text-gray-500">
                Filter verified transporters, brokers & routes across India
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition border border-gray-200 cursor-pointer shrink-0 active:scale-95"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset All</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>

        {/* SLIDING SEGMENTED CONTROL */}
        <div className="w-full max-w-lg mx-auto mb-6 sm:mb-8">
          <div className="relative p-1 bg-gray-100/90 rounded-2xl flex items-center border border-gray-200/80">
            {/* Tab 1 */}
            <button
              type="button"
              onClick={() => setSearchMode("location")}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer select-none ${
                searchMode === "location"
                  ? "text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MapPin
                size={16}
                className={
                  searchMode === "location" ? "text-blue-600" : "text-gray-400"
                }
              />
              <span>Location Search</span>
              {searchMode === "location" && (
                <motion.div
                  layoutId="activeSearchTab"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-md border border-gray-100 -z-10"
                />
              )}
            </button>

            {/* Tab 2 */}
            <button
              type="button"
              onClick={() => setSearchMode("business")}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer select-none ${
                searchMode === "business"
                  ? "text-purple-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2
                size={16}
                className={
                  searchMode === "business"
                    ? "text-purple-600"
                    : "text-gray-400"
                }
              />
              <span>Firm / Owner No.</span>
              {searchMode === "business" && (
                <motion.div
                  layoutId="activeSearchTab"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-md border border-gray-100 -z-10"
                />
              )}
            </button>
          </div>
        </div>

        {/* FORMS */}
        <AnimatePresence mode="wait">
          {searchMode === "location" ? (
            <motion.form
              key="location-form"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLocationSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 items-end"
            >
              <div>
                <label className="text-[15px] font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <MapPin size={14} className="text-blue-600" />
                  State
                </label>
                <LocationSearchInput
                  placeholder="Search State..."
                  selectedValue={selectedState}
                  onSelectLocation={(loc) =>
                    setSelectedState(loc ? loc.name : "")
                  }
                />
              </div>

              <div>
                <label className="text-[15px] font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <MapPin size={14} className="text-green-600" />
                  City
                </label>
                <LocationSearchInput
                  placeholder="Search City..."
                  selectedValue={selectedCity}
                  onSelectLocation={(loc) =>
                    setSelectedCity(loc ? loc.name : "")
                  }
                />
              </div>

              <div>
                <label className="text-[15px] font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <Briefcase size={14} className="text-orange-500" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-[48px] bg-gray-50/80 border border-gray-200 rounded-2xl px-4 text-sm text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition cursor-pointer"
                >
                  {transportCategories.map((cat, index) => (
                    <option key={index} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-[48px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition shadow-lg shadow-blue-500/25 cursor-pointer text-sm"
              >
                <Search size={18} />
                Search Directory
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="business-form"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleBusinessSearch}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 items-end"
            >
              <div>
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <CircleDot size={14} className="text-purple-600" />
                  Select category (Firm/Owner/Number)
                </label>
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className="w-full h-[48px] bg-gray-50/80 border border-gray-200 rounded-2xl px-4 text-sm text-gray-800 outline-none focus:border-purple-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="firmName">Firm Name</option>
                  <option value="ownerName">Owner Name</option>
                  <option value="phoneNumber">Phone Number</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <Search size={14} className="text-purple-600" />
                  Search Keyword / Number
                </label>
                <input
                  type={searchBy === "phoneNumber" ? "tel" : "text"}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchBy === "firmName"
                      ? "Enter Firm Name..."
                      : searchBy === "ownerName"
                        ? "Enter Owner Name..."
                        : "Enter Phone Number..."
                  }
                  className="w-full h-[48px] bg-gray-50/80 border border-gray-200 rounded-2xl px-4 text-sm text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full h-[48px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition shadow-lg shadow-purple-500/25 cursor-pointer text-sm"
              >
                <Search size={18} />
                Search Business
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* ==========================================
          DIRECTORY RESULT SECTION
      ========================================== */}
      <div ref={resultsRef} className="scroll-mt-24">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            Directory Results
            <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {directoryData.length}{" "}
              {directoryData.length === 1 ? "Partner" : "Partners"}
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-24 sm:py-28 font-medium text-gray-500 animate-pulse">
            Loading Directory Details...
          </div>
        ) : directoryData.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-16 text-center text-gray-500 font-medium shadow-sm border border-gray-100">
            No Transport Found matching your criteria.
          </div>
        ) : (
          <div className="w-full space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-7">
              {directoryData.map((item, index) => {
                const displayPhone = isLoggedIn
                  ? item.phoneNumber
                  : maskPhoneNumber(item.phoneNumber);
                const formattedRole = item.role
                  ? item.role.replace(/_/g, " ")
                  : "Transport Services";
                const rating = Number(item.averageRating || 0).toFixed(1);
                const reviews = item.totalReviews || 0;
                const cardId = `directory-card-${item._id || index}`;
                const location = [item.address, item.city, item.state]
                  .filter(Boolean)
                  .join(", ");
                const phoneForLink = String(item.phoneNumber || "").replace(/[^0-9+]/g, "");
                const currentGalleryImage = typeof item.photo === "string"
                  ? item.photo
                  : item.photo?.url || item.photo?.imageUrl || item.photo?.secure_url || "";

                const openEnquiry = () => {
                  if (!item._id) return;
                  sessionStorage.setItem("lastViewedDirectoryCardId", cardId);
                  const targetUrl = `/dashboard/transporters/${item._id}`;
                  if (!isLoggedIn) {
                    sessionStorage.setItem("authRedirectUrl", targetUrl);
                    navigate("/login", { state: { returnTo: targetUrl } });
                    return;
                  }
                  navigate(targetUrl);
                };

                // If there is no profile photo, render ONE compact information card.
                // Do not render the original photo-layout card beside it.
                if (!currentGalleryImage) {
                  return (
                    <motion.article
                      key={item._id || index}
                      id={cardId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        type="button"
                        onClick={openEnquiry}
                        className="w-full overflow-hidden rounded-lg border border-gray-100 bg-white text-left"
                        aria-label={`View profile of ${item.firmName || "Transport Partner"}`}
                      >
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white sm:p-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-white/20 text-xl font-bold">
                            {(item.firmName || "T").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-base font-bold leading-snug">
                              {item.firmName || "Transport Partner"}
                            </p>
                            <p className="mt-1 text-sm text-white/85">
                              {item.ownerName || formattedRole}
                            </p>
                          </div>
                          {item.isVerified && (
                            <span className="shrink-0 rounded-full border border-white/50 px-2 py-1 text-xs font-semibold">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 p-3 sm:p-4">
                          {!!location && (
                            <p className="text-sm sm:text-base text-gray-700">
                              <MapPin size={16} className="mr-1 inline text-red-500" />
                              {location}
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                              <p className="text-xs uppercase tracking-wide text-gray-500">Rating</p>
                              <p className="text-base font-bold text-gray-800">
                                ⭐ {rating} <span className="text-sm font-normal text-gray-500">({reviews})</span>
                              </p>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                              <p className="text-xs uppercase tracking-wide text-gray-500">Contact</p>
                              <p className="truncate text-base font-bold text-gray-800">
                                {isLoggedIn ? (item.phoneNumber || "Not provided") : "Login to view"}
                              </p>
                            </div>
                          </div>
                          <p className="line-clamp-2 rounded-lg border border-blue-100 bg-blue-50 p-2.5 text-sm text-blue-800">
                            <Truck size={15} className="mr-1 inline" />
                            {item.totalVehicles > 0
                              ? `${item.totalVehicles} Vehicles${item.vehicleTypes?.length ? `: ${item.vehicleTypes.join(", ")}` : ""}`
                              : (item.category ? String(item.category).replace(/_/g, " ") : formattedRole)}
                          </p>
                        </div>
                      </button>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={isLoggedIn && phoneForLink ? `tel:${phoneForLink}` : undefined}
                          onClick={(e) => {
                            if (!isLoggedIn) {
                              e.preventDefault();
                              sessionStorage.setItem("authRedirectUrl", `/dashboard/transporters/${item._id}`);
                              navigate("/login", { state: { returnTo: `/dashboard/transporters/${item._id}` } });
                            } else if (!phoneForLink) {
                              e.preventDefault();
                            }
                          }}
                          className="inline-flex min-w-[100px] flex-1 items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2.5 text-base font-bold text-white hover:bg-green-800"
                        >
                          <Phone size={16} fill="currentColor" /> Call
                        </a>
                        <a
                          href={isLoggedIn && phoneForLink ? `https://wa.me/${phoneForLink.replace(/\\D/g, "")}` : undefined}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            if (!isLoggedIn) {
                              e.preventDefault();
                              sessionStorage.setItem("authRedirectUrl", `/dashboard/transporters/${item._id}`);
                              navigate("/login", { state: { returnTo: `/dashboard/transporters/${item._id}` } });
                            } else if (!phoneForLink) {
                              e.preventDefault();
                            }
                          }}
                          className="inline-flex min-w-[100px] flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base font-bold text-gray-900 hover:bg-gray-50"
                        >
                          <MessageCircle size={16} className="text-green-600" /> WhatsApp
                        </a>
                        <button
                          type="button"
                          onClick={openEnquiry}
                          className="inline-flex min-w-[100px] flex-1 items-center justify-center gap-2 rounded-md bg-sky-600 px-3 py-2.5 text-base font-bold text-white hover:bg-sky-700"
                        >
                          <UserIcon size={16} /> View Profile
                        </button>
                      </div>
                    </motion.article>
                  );
                }

                return (
                  <motion.article
                    key={item._id || index}
                    id={cardId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                      <div className="w-full sm:w-[118px] sm:min-w-0 sm:flex-1 h-[220px] sm:h-[250px] overflow-hidden rounded-lg border border-gray-100 bg-white">
                        {currentGalleryImage ? (
                          <img
                            src={currentGalleryImage}
                            alt={item.firmName || "Profile"}
                            className="h-full w-full object-cover cursor-pointer"
                            onClick={openEnquiry}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = "flex";
                              }
                            }}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={openEnquiry}
                            className="flex h-full w-full flex-col items-center bg-white text-left"
                            aria-label={`View profile of ${item.firmName || "Transport Partner"}`}
                          >
                            <div className="flex w-full items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white sm:p-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-white/20 text-xl font-bold">
                                {(item.firmName || "T").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-sm font-bold leading-snug">
                                  {item.firmName || "Transport Partner"}
                                </p>
                                <p className="mt-1 text-xs text-white/85">
                                  {item.ownerName || formattedRole}
                                </p>
                              </div>
                              {item.isVerified && (
                                <span className="shrink-0 rounded-full border border-white/50 px-2 py-1 text-[10px] font-semibold">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex w-full flex-1 flex-col gap-2 p-3 sm:p-4">
                              <p className="text-xs sm:text-sm text-gray-700">
                                <MapPin size={14} className="mr-1 inline text-red-500" />
                                {location || "Location not provided"}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                                  <p className="text-[10px] uppercase tracking-wide text-gray-400">Rating</p>
                                  <p className="text-sm font-bold text-gray-800">⭐ {rating} <span className="text-xs font-normal text-gray-500">({reviews})</span></p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                                  <p className="text-[10px] uppercase tracking-wide text-gray-400">Contact</p>
                                  <p className="truncate text-sm font-bold text-gray-800">
                                    {isLoggedIn ? (item.phoneNumber || "Not provided") : "Login to view"}
                                  </p>
                                </div>
                              </div>
                              <p className="line-clamp-2 rounded-lg border border-blue-100 bg-blue-50 p-2 text-xs text-blue-800">
                                <Truck size={13} className="mr-1 inline" />
                                {item.totalVehicles > 0
                                  ? `${item.totalVehicles} Vehicles${item.vehicleTypes?.length ? `: ${item.vehicleTypes.join(", ")}` : ""}`
                                  : (item.category ? String(item.category).replace(/_/g, " ") : formattedRole)}
                              </p>
                              <div className="mt-auto rounded-lg bg-teal-700 px-3 py-2 text-center text-sm font-semibold text-white">
                                View Transport Profile
                              </div>
                            </div>
                          </button>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-white">
                            <ThumbsUp size={15} />
                          </div>
                          <h4 className="min-w-0 flex-1 truncate text-lg sm:text-[21px] font-semibold leading-7 text-gray-950">
                            {item.firmName || "Unnamed Firm"}
                          </h4>
                          {item.isVerified && (
                            <span className="hidden sm:inline-flex shrink-0 items-center gap-1 text-sm font-bold text-sky-600">
                              <CheckCircle2 size={17} className="fill-sky-100" />
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-green-700 px-2 py-1 text-sm font-extrabold text-white">
                            {rating} ★
                          </span>
                          <span className="text-sm sm:text-base text-gray-500">
                            {reviews} Ratings
                          </span>
                          {item.isVerified && (
                            <span className="inline-flex sm:hidden items-center gap-1 text-xs font-bold text-sky-600">
                              <CheckCircle2 size={14} /> Verified
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs sm:text-sm font-semibold text-gray-800">
                            <Flame size={14} className="fill-orange-400 text-orange-500" />
                            Trending
                          </span>
                        </div>

                        {!!location && (
                          <div className="mt-3 flex items-start gap-2 text-sm sm:text-base text-gray-800">
                            <MapPin size={19} className="mt-0.5 shrink-0 text-gray-800" />
                            <span className="line-clamp-2">{location}</span>
                          </div>
                        )}

                        <div className="mt-2">
                          <span className="inline-flex max-w-full rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs sm:text-sm capitalize text-gray-800">
                            {item.category
                              ? String(item.category).replace(/_/g, " ")
                              : formattedRole}
                          </span>
                        </div>

                        {item.totalVehicles > 0 && (
                          <p className="mt-2 text-xs sm:text-sm text-gray-600">
                            <Truck size={14} className="mr-1 inline text-blue-600" />
                            {item.totalVehicles} {item.totalVehicles === 1 ? "Vehicle" : "Vehicles"}
                            {item.vehicleTypes?.length ? ` · ${item.vehicleTypes.join(", ")}` : ""}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 sm:mt-auto sm:pt-4">
                          <a
                            href={phoneForLink ? `tel:${phoneForLink}` : undefined}
                            onClick={(e) => {
                              sessionStorage.setItem("lastViewedDirectoryCardId", cardId);
                              if (!isLoggedIn) {
                                e.preventDefault();
                                sessionStorage.setItem("authRedirectUrl", `/dashboard/transporters/${item._id}`);
                                navigate("/login", { state: { returnTo: `/dashboard/transporters/${item._id}` } });
                              } else if (!phoneForLink) {
                                e.preventDefault();
                              }
                            }}
                            className="inline-flex min-w-[125px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-green-800"
                          >
                            <Phone size={17} fill="currentColor" /> Call
                          </a>

                          <a
                            href={phoneForLink ? `https://wa.me/${phoneForLink.replace(/\D/g, "")}` : undefined}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => {
                              if (!isLoggedIn) {
                                e.preventDefault();
                                sessionStorage.setItem("authRedirectUrl", `/dashboard/transporters/${item._id}`);
                                navigate("/login", { state: { returnTo: `/dashboard/transporters/${item._id}` } });
                              } else if (!phoneForLink) {
                                e.preventDefault();
                              }
                            }}
                            className="inline-flex min-w-[125px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm sm:text-base font-bold text-gray-900 hover:bg-gray-50"
                          >
                            <MessageCircle size={18} className="text-green-600" /> WhatsApp
                          </a>

                          <button
                            type="button"
                            onClick={openEnquiry}
                            className="inline-flex min-w-[125px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-sky-700"
                          >
                            <UserIcon size={17} /> View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-2xl font-bold text-gray-900"
            aria-label="Close image"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Profile"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Directory;

