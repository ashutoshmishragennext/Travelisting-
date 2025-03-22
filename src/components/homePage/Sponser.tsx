import React from 'react'
import BrandGrid from '../HomeOur';



const Sponser = () => {
    const brands = [
        { name: "Oyo", logo: "/oyo.png" },
         { name: "Voltas", logo: "/lenskart.jpg"},
         { name: "Una", logo: "/una.jpg" },
        // { name: "Hitachi", logo: "https://bsmedia.business-standard.com/_media/bs/img/article/2021-01/04/full/20210104150524.jpg" },
        // {name: "indiamart", logo:"https://bsmedia.business-standard.com/_media/bs/img/article/2023-10/27/full/1698408402-7662.jpg?im=FeatureCrop,size=(826,465)"},
        // {name: "cse", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/CSC_Logo.svg/1024px-CSC_Logo.svg.png"},
        // {name: "sarvodya", logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTENViOztQzq_lFovHq3xdQVDy_8r18NnrvDg&s"},
        // {name: "bdo", logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7NfjTTuyu1Em0vShEgCBy_CxGf6xZB4xvMw&s"},
        // {name: "rbs", logo:"https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/RBS_International.svg/800px-RBS_International.svg.png"},
        // {name: "sarvodya", logo:"https://upsma.org/wp-content/uploads/2023/07/UPSMA-LOG-with-black-Text.png"},
        // {name: "sarvodya", logo:"https://assets.lybrate.com/img/documents/clinic/logo/9493fd4419f713f53e3f77c9810d2050/BNCHY-Wellness-Medispa-Delhi-83bba5"},
        // {name: "sarvodya", logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBIoIr2Y33v0IdprP2CEPnEU07j1IPUUyjnw&s"},
        
      ];
  return (
    <div><div className="p-4 bg-gray-50">
    <BrandGrid brands={brands} />
  </div></div>
  )
}

export default Sponser