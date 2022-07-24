import mongoose from 'mongoose';
import Card from './card-model';
import HttpError from '../../utils/HttpError';
import cardService from './card-service';

const { ObjectId } = mongoose.Types;

jest.mock('./card-model');
const mockSave = jest.fn();
const mockSelect = jest.fn();

const mockCardsList = {
  cards: [
    {
      _id: '62aba6a7ebf2fbe18e3023ba',
      nativeText: 'and',
      foreignText: 'y',
    },
    {
      _id: '62aba6b2ebf2fbe18e3023bc',
      nativeText: 'or',
      foreignText: 'o',
    },
  ],
  select: mockSelect,
};

const mockCard = {
  _id: new ObjectId('62abaca76773f91356074f8e'),
  nativeText: 'bye',
  foreignText: 'adiós',
  userId: new ObjectId('62a203fd6d3af1cd9c032094'),
  __v: 0,
  save: mockSave,
};

const mockSavedCard = {
  _id: new ObjectId('62abaca76773f91356074f8e'),
  nativeText: 'dog',
  foreignText: 'perro',
  userId: new ObjectId('62a203fd6d3af1cd9c032094'),
  __v: 0,
};

describe('Card service\'s getCards method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return cards from database', async () => {
    const req = { user: { _id: '6257326ca4457e2db2e75614' } };
    Card.find.mockReturnValue(mockCardsList);
    mockSelect.mockResolvedValueOnce(mockCardsList);
    const data = await cardService.getCards(req.user._id);
    expect(data).toEqual(mockCardsList);
  });
});

describe('Card service\'s createCard method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if request body is missing', async () => {
    expect.assertions(3);
    const req = { user: { _id: '6257326ca4457e2db2e75614' }, body: {} };
    try {
      await cardService.createCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.message).toBe('All fields are required.');
    }
  });

  it('should throw an error if body only has foreign text', async () => {
    expect.assertions(3);
    const req = { user: { _id: '6257326ca4457e2db2e75614' }, body: { foreignText: 'perro' } };
    try {
      await cardService.createCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.message).toBe('Native text is required.');
    }
  });

  it('should throw an error if body only has native text', async () => {
    expect.assertions(3);
    const req = { user: { _id: '6257326ca4457e2db2e75614' }, body: { nativeText: 'dog' } };
    try {
      await cardService.createCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.message).toBe('Foreign text is required.');
    }
  });

  it('should return true if card is created', async () => {
    const req = {
      user: { _id: '6257326ca4457e2db2e75614' },
      body: { nativeText: 'dog', foreignText: 'perro' },
    };
    Card.prototype.save.mockReturnValue(mockSavedCard);
    const data = await cardService.createCard(req);
    expect(data).toEqual(true);
  });
});

describe('Card service\'s updateCard method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if request body is missing', async () => {
    expect.assertions(3);
    const req = { user: { _id: '6257326ca4457e2db2e75614' }, body: {} };
    try {
      await cardService.updateCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.message).toBe('All fields are required.');
    }
  });

  it('should throw an error if body only has foreign text', async () => {
    expect.assertions(3);
    const req = { user: { _id: '6257326ca4457e2db2e75614' }, body: { foreignText: 'perro' } };
    try {
      await cardService.updateCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.message).toBe('Native text is required.');
    }
  });

  it('should throw an error if body only has native text', async () => {
    expect.assertions(3);
    const req = { user: { _id: '6257326ca4457e2db2e75614' }, body: { nativeText: 'dog' } };
    try {
      await cardService.updateCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.message).toBe('Foreign text is required.');
    }
  });

  it('should throw an error if card ID is not valid', async () => {
    expect.assertions(3);
    const req = {
      user: { _id: '6257326ca4457e2db2e75614' },
      body: { nativeText: 'dog', foreignText: 'perro' },
      params: { cardId: 'xxx' },
    };
    try {
      await cardService.updateCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(404);
      expect(err.message).toBe('Card ID is not valid.');
    }
  });

  it('should throw an error if user IDs don\'t match', async () => {
    expect.assertions(3);
    const req = {
      user: { _id: '62a203fd6d3af1cd9c03209x' },
      body: { nativeText: 'dog', foreignText: 'perro' },
      params: { cardId: '62abaca76773f91356074f8e' },
    };
    Card.findOne.mockReturnValue(mockCard);
    try {
      await cardService.updateCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(403);
      expect(err.message).toBe('Permission denied.');
    }
  });

  it('should return true if card is updated', async () => {
    const req = {
      user: { _id: '62a203fd6d3af1cd9c032094' },
      body: { nativeText: 'dog', foreignText: 'perro' },
      params: { cardId: '62abaca76773f91356074f8e' },
    };
    Card.findOne.mockReturnValue(mockCard);
    mockCard.save.mockReturnValue(mockSavedCard);
    const data = await cardService.updateCard(req);
    expect(data).toEqual(true);
  });
});

describe('Card service\'s deleteCard method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if card ID is not valid', async () => {
    expect.assertions(3);
    const req = {
      user: { _id: '6257326ca4457e2db2e75614' },
      params: { cardId: 'xxx' },
    };
    try {
      await cardService.deleteCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(404);
      expect(err.message).toBe('Card ID is not valid.');
    }
  });

  it('should throw an error if user IDs don\'t match', async () => {
    expect.assertions(3);
    const req = {
      user: { _id: '62a203fd6d3af1cd9c03209x' },
      params: { cardId: '62abaca76773f91356074f8e' },
    };
    Card.findOne.mockReturnValue(mockCard);
    try {
      await cardService.deleteCard(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(403);
      expect(err.message).toBe('Permission denied.');
    }
  });

  it('should return true if card is deleted', async () => {
    const req = {
      user: { _id: '62a203fd6d3af1cd9c032094' },
      params: { cardId: '62abaca76773f91356074f8e' },
    };
    Card.findOne.mockReturnValue(mockCard);
    Card.deleteOne.mockResolvedValueOnce({ acknowledged: true });
    const data = await cardService.deleteCard(req);
    expect(data).toEqual(true);
  });
});
