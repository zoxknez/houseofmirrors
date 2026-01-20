export const propertyImages = {
    hero: [
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786323726.jpg?k=f6be8686036d3ba5859a03b1e8c3df50c730fc9602670b6206d85c827efc5750&o=",
            alt: "Dnevna soba sa masažnom foteljom",
            priority: true
        },
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786322119.jpg?k=635ff5c1eb476536f0419ac299feaeb978728129773609f95e0c08442e9e4191&o=",
            alt: "Spavaća soba sa ogledalom na plafonu",
            priority: true
        },
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786324262.jpg?k=d9710ebc972930d71e359dc47fc60763c53c6e3c6ca9d118f9ed23978b3e72b1&o=",
            alt: "Entertainment sistem sa velikim TV-om",
            priority: false
        }
    ],

    gallery: [
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786323726.jpg?k=f6be8686036d3ba5859a03b1e8c3df50c730fc9602670b6206d85c827efc5750&o=",
            alt: "Dnevna soba",
            category: "living"
        },
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786322119.jpg?k=635ff5c1eb476536f0419ac299feaeb978728129773609f95e0c08442e9e4191&o=",
            alt: "Spavaća soba sa ogledalima",
            category: "bedroom"
        },
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786324262.jpg?k=d9710ebc972930d71e359dc47fc60763c53c6e3c6ca9d118f9ed23978b3e72b1&o=",
            alt: "Entertainment sistem",
            category: "living"
        },
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786323984.jpg?k=60c733dc7ce9852d397c97d8c875ce7f5cda4393e3ff73e27547866f27b72c75&o=",
            alt: "Masažna fotelja",
            category: "wellness"
        },
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786322092.jpg?k=6f0b8f398b9a51cb28a68dbabf771024d2ca26fbaebce901c21e4afe94054dc2&o=",
            alt: "Kuhinja",
            category: "kitchen"
        },
        {
            src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/786322047.jpg?k=e410bafea2379863ab2041ef8aa8697725cbd1df6e659056df167bd180c8fedb&o=",
            alt: "Kupatilo",
            category: "bathroom"
        },
        {
            src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1562587044814690888/original/35623df4-d814-4a39-9871-06a476a4e6d6.jpeg",
            alt: "Eksterijer - ulaz",
            category: "exterior"
        },
        {
            src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1562587044814690888/original/3ed9505f-8e91-4f17-95b6-5d5cc08cae4c.jpeg",
            alt: "Spavaća soba detalj",
            category: "bedroom"
        },
        {
            src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1562587044814690888/original/66d8b1e6-4986-4fc3-acf8-16ea24bca5b0.jpeg",
            alt: "Dnevna soba sa masažnom foteljom",
            category: "living"
        },
        {
            src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1562587044814690888/original/2e7a0e3e-472e-41e9-8ded-12956e9d8310.jpeg",
            alt: "Pogled na kuhinju",
            category: "kitchen"
        },
        {
            src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1562587044814690888/original/45a38f1f-7b99-4588-b050-5c243a51ac36.jpeg",
            alt: "Kupatilo detalj",
            category: "bathroom"
        },
        {
            src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1562587044814690888/original/dec03997-f4fd-46ef-b553-db609b0fbde6.jpeg",
            alt: "Sto za masažu",
            category: "wellness"
        }
    ],

    categories: [
        { id: "all", label: "Sve" },
        { id: "living", label: "Dnevna soba" },
        { id: "bedroom", label: "Spavaća soba" },
        { id: "kitchen", label: "Kuhinja" },
        { id: "bathroom", label: "Kupatilo" },
        { id: "wellness", label: "Wellness" },
        { id: "exterior", label: "Eksterijer" }
    ]
};

export type PropertyImages = typeof propertyImages;
