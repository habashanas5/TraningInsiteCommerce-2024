import { Request, Response } from "express";

const diagnostics = async (request: Request, response: Response) => {
    const { authorization } = request.headers;
    if (!authorization) {
        response.status(401).send();
        return;
    }

    const authenticationResponse = await fetch(
        `${process.env.ISC_API_URL}/api/internal/contentadmin/CheckAuthentication`,
        { headers: { authorization } },
    );
    const text = await authenticationResponse.text();

    const { status } = authenticationResponse;
    if (status !== 200) {
        response
            .status(status)
            .contentType(authenticationResponse.headers.get("Content-Type") ?? "text/plain")
            .send(text);
        return;
    }

    const { ISC_API_URL, BLUEPRINT, BUILD_INFO } = process.env;

    response.json({
        Node: process.version,
        ISC_API_URL,
        BLUEPRINT,
        BUILD_INFO,
    });
};

export default diagnostics;
