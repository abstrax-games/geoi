// jest.setup.ts
jest.mock("typeorm", () => ({
    PrimaryGeneratedColumn: jest.fn(),
    Entity: jest.fn(),
    ManyToOne: jest.fn(),
    Column: jest.fn(),
    UpdateDateColumn: jest.fn(),
    CreateDateColumn: jest.fn(),
    DataSource: jest.fn().mockImplementation(() => ({
        getRepository: jest.fn(),
        initialize: jest.fn().mockResolvedValue({}),
    })),
}));
