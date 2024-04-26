const menuItems = [
    {
        title: "Power Tools",
        url: "/accessories",
        children: [
            { title: "Grinders", url: "/test" },
            {
                title: "Saws",
                url: "/test",
                children: [
                    { title: "Bandsaws", url: "/test" },
                    { title: "Chop Saws", url: "/test" },
                    { title: "Circular Saws", url: "/test" },
                    { title: "JigSawsAreTheKindYouMakePuzzlesWith", url: "/test" },
                    { title: "Miter Saws", url: "/test" },
                    { title: "Radial Arm Saws", url: "/test" },
                    { title: "Table Saws", url: "/test" },
                    {
                        title: "Small saws",
                        url: "/test",
                        children: [
                            { title: "Chop Saws", url: "/test" },
                            { title: "Jigsaws", url: "/test" },
                        ],
                    },
                    {
                        title: "BigSawsWithNoWordBreakInText",
                        url: "/test",
                        children: [
                            { title: "Radial Arm Saws", url: "/test" },
                            { title: "Table Saws", url: "/test" },
                            { title: "Miter Saws", url: "/test" },
                            { title: "Bandsaws", url: "/test" },
                            { title: "Circular Saws", url: "/test" },
                        ],
                    },
                ],
            },
            { title: "Impact Driver", url: "/test" },
            { title: "Rotary Hammer", url: "/test" },
            { title: "Computer Aided Drafting Routers", url: "/test" },
            { title: "Air compressors", url: "/test" },
            { title: "Angle grinders", url: "/test" },
            { title: "Bandsaws", url: "/test" },
            { title: "Belt Sanders", url: "/test" },
            { title: "Biscuit Joiners", url: "/test" },
            { title: "Chainsaws", url: "/test" },
            { title: "Chop Saws", url: "/test" },
            { title: "Circular Saws", url: "/test" },
            { title: "Disc Sanders", url: "/test" },
            { title: "Drills", url: "/test" },
            { title: "Hammer Drills", url: "/test" },
            { title: "Heat Guns", url: "/test" },
            { title: "Impact Drivers", url: "/test" },
            { title: "Impact Wrenches", url: "/test" },
            { title: "Jointers", url: "/test" },
            { title: "Jigsaws", url: "/test" },
            { title: "Lathes", url: "/test" },
            { title: "Miter Saws", url: "/test" },
            { title: "Nail Guns", url: "/test" },
            { title: "Orbital Sanders", url: "/test" },
            { title: "Oscillating Tools", url: "/test" },
            { title: "Planers", url: "/test" },
            { title: "Power Screwdrivers", url: "/test" },
            { title: "Radial Arm Saws", url: "/test" },
            { title: "Reciprocating Saws", url: "/test" },
            { title: "Rotary Tools", url: "/test" },
            { title: "Routers", url: "/test" },
            { title: "Scroll Saws", url: "/test" },
            { title: "Shop Vacuums", url: "/test" },
            { title: "Table Saws", url: "/test" },
            { title: "Wall Chasers", url: "/test" },
        ],
    },
    {
        title: "Accessories",
        url: "/test",
    },
    {
        title: "Manual Tools",
        url: "/test",
    },
    {
        title: "Jobsite Organization",
        url: "/test",
    },
    {
        title: "Safety and Personal Protection Equipment",
        url: "/test",
    },
];

export const conciseNames = ["Power Tools", "Machiners", "Saws", "Radial Arm"];
export const conciseMenuItems = [
    {
        title: conciseNames[0],
        url: "/accessories",
        children: [
            {
                title: conciseNames[1],
                url: "/test",
                children: [
                    { title: conciseNames[2], url: "/test", children: [{ title: conciseNames[3], url: "/test" }] },
                ],
            },
        ],
    },
];

export default menuItems;
