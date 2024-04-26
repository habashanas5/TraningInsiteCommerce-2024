import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { getDiagnostics } from "@insite/shell/Services/SpireService";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const About: React.FC = () => {
    const [spireStuff, update] = useState<SafeDictionary<string> | undefined>();

    useEffect(() => {
        if (spireStuff) {
            return;
        }

        update({ Loading: "..." });

        getDiagnostics().then(diagnostics => {
            update(diagnostics);
        });
    });

    return (
        <>
            {spireStuff && (
                <table>
                    <tbody>
                        {Object.keys(spireStuff).map(key => (
                            <tr key={key}>
                                <KeyColumn>{key}</KeyColumn>
                                <td>{spireStuff[key]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

const KeyColumn = styled.td`
    padding-right: 10px;
`;

export default About;
