import Dialog from "../Dialog/Dialog";
import DialogSubTabs from "../Dialog/DialogSubTabs";
import DialogTabs from "../Dialog/DialogTabs";
import WardrobeSelection from "./WardrobeSelection";

export default function WardrobeDialog() {
    return (
        <Dialog title="Wardrobe">
            <DialogTabs initialActiveIndex={1} tabs={[
                {
                    icon: (<div className="sprite_wardrobe_generic_tab"/>),
                    element: (
                        <DialogSubTabs tabs={[
                            {
                                icon: (<div className="sprite_wardrobe_male"/>),
                                activeIcon: (<div className="sprite_wardrobe_male_on"/>),
                                element: (<div>male</div>)
                            },
                            {
                                icon: (<div className="sprite_wardrobe_female"/>),
                                activeIcon: (<div className="sprite_wardrobe_female_on"/>),
                                element: (<div>female</div>)
                            }
                        ]}/>
                    )
                },
                {
                    icon: (<div className="sprite_wardrobe_head_tab"/>),
                    element: (
                        <DialogSubTabs tabs={[
                            {
                                icon: (<div className="sprite_wardrobe_head_hair"/>),
                                activeIcon: (<div className="sprite_wardrobe_head_hair_on"/>),
                                element: (<WardrobeSelection/>)
                            },
                            {
                                icon: (<div className="sprite_wardrobe_head_hats"/>),
                                activeIcon: (<div className="sprite_wardrobe_head_hats_on"/>),
                                element: (<div>hats</div>)
                            },
                            {
                                icon: (<div className="sprite_wardrobe_head_accessories"/>),
                                activeIcon: (<div className="sprite_wardrobe_head_accessories_on"/>),
                                element: (<div>accessories</div>)
                            },
                            {
                                icon: (<div className="sprite_wardrobe_head_eyewear"/>),
                                activeIcon: (<div className="sprite_wardrobe_head_eyewear_on"/>),
                                element: (<div>eyewear</div>)
                            },
                            {
                                icon: (<div className="sprite_wardrobe_head_face_accessories"/>),
                                activeIcon: (<div className="sprite_wardrobe_head_face_accessories_on"/>),
                                element: (<div>face_accessories</div>)
                            }
                        ]}/>
                    )
                },
                {
                    icon: (<div className="sprite_wardrobe_torso_tab"/>),
                    element: <div>test</div>
                },
                {
                    icon: (<div className="sprite_wardrobe_legs_tab"/>),
                    element: <div>test</div>
                }
            ]}/>
        </Dialog>
    )
}
