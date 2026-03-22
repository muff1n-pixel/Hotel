import { useEffect, useState } from "react"
import Loading from "../Loading/Loading"
import StaffUser, { StaffUserType } from "./StaffUser/StaffUser"
import Box from "../Box/Box"

type StaffRankRoleSection = {
    id: string,
    name: string,
    description: string
}

export type StaffRankType = {
    id: string,
    name: string,
    description: string,
    roles: Array<StaffRankRoleSection>
}

const StaffSection = (props: StaffRankType) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<Array<StaffUserType>>([])

    const getRolesAsArray = () => {
        let roles: Array<string> = [];

        props.roles.forEach((role) => {
            roles.push(role.id);
        })

        return roles;
    }

    useEffect(() => {
        fetch("/api/ranks/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roles: getRolesAsArray()
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error)
                    return console.log("(Error) Impossible to fetch staff users:", result.error);

                setUsers(result);
                setLoading(false);
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch staff users:", e)
            })
    }, [])

    const getRolesAsString = () => {
        let roles = "";

        props.roles.forEach((role) => {
            roles += `${role.name}, `
        })

        return roles.slice(0, -2);
    }

    return (
        <Box title={{
            name: props.name,
            subtitle: getRolesAsString()
        }}>
            {
                loading ?
                    <Loading />
                    :
                    <div>
                        {users.map((user) => {
                            return (
                                <StaffUser {...user} key={user.id} />
                            )
                        })}
                    </div>
            }
        </Box>
    )
}

export default StaffSection;