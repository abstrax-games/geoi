// Utility to mock session and privilege check
export const mockSessionAndPrivilege = (
    user: any = null,
    privilege: any = null
) => {
    jest.mock("../src/middlewares/checkPrivilege", () => {
        return jest.fn(() => async (request, reply) => {
            if (user) {
                // Simulate a logged-in user
                request.user = user;
            } else {
                // Simulate no user (not logged in)
                return reply.code(401).send({ error: "Unauthorized" });
            }

            // Check if the user has the necessary privilege
            if (privilege && !user.privileges.includes(privilege)) {
                return reply.code(403).send({ error: "Forbidden" });
            }

            return true;
        });
    });
};

// Utility to simulate a valid session cookie
export const mockValidSession = () => ({
    Cookie: "ax-session-cookie=valid-session-id", // Example mock cookie
});