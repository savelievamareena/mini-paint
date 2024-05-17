export const cardsContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

export const select = {
    my: "30px",
    width: "50%",
    alignSelf: "flex-start",
};

export const cardElementsWrapper = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "30px",
    alignSelf: "flex-start",
    marginBottom: "20px",
};

export const modal = {
    height: 800,
    width: 800,
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};
