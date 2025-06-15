# ZeroGPT
[![Версия](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/username/project/releases)
[![Лицензия](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Stage](https://img.shields.io/badge/stage-alpha-red.svg)

ZeroGPT - это Python-библиотека для взаимодействия с API искусственного интеллекта, предоставляющая возможности генерации текста и изображений.

## Особенности

- Генерация текста с использованием различных моделей
- Создание изображений на основе текстовых описаний
- Поддержка режима "uncensored" для более свободных ответов
- Оптимизированная работа с памятью и данными
- Поддержка потоковой передачи данных
- Безопасная аутентификация запросов

## Установка

```bash
pip install zerogpt
```

## Использование

### Инициализация клиента

```python
from zerogpt import Client

client = Client()
```

### Генерация текста

```python
# Простой запрос
response = client.send_message("Привет, как дела?")

# Запрос с инструкцией
response = client.send_message(
    "Расскажи о космосе",
    instruction="Ты - эксперт по астрономии"
)

# Использование режима "uncensored"
response = client.send_message(
    "Расскажи о сложной теме",
    uncensored=True
)

# Использование режима "think" (более глубокое мышление)
response = client.send_message(
    "Реши сложную математическую задачу",
    think=True
)

# контекст
messages=[
    {"role": "user", "content": "Привет"},
    {"role": "assistant", "content": "Здравствуйте!"}
]
response = client.send_message(
    messages,
    think=True
)
```

### Генерация изображений

```python
# Создание изображения
result = client.create_image(
    prompt="anime neko girl",
    samples=1,
    resolution=(768, 512),
    seed=-1,
    steps=50
)

# Получение сгенерированного изображения
image = client.get_image(result['data']['request_id'])

# Сохранение изображения
image.download(['path/to/save/image.png'])

# Просмотр изображения
image.open()
```

### Работа с контекстом Dummy[^1]

```python
from zerogpt.utils.prompt import Dummy

# Создание контекста
dummy = Dummy()
dummy.create(messages=[
    {"role": "user", "content": "Привет"},
    {"role": "assistant", "content": "Здравствуйте!"}
])

#так же возможен вариант с генерацией изображений:
dummy = Dummy()
dummy.create(prompt='neko girl', steps=100)
# Сохранение контекста
dummy.save("context.bin")

# Загрузка контекста
dummy.load("context.bin")

#для передачи нужно заменить messages на наш обьект:
#client.send_message(dummy)
#или
#client.create_image(dummy)
```

## Параметры

### send_message

- `input` (str или list): Текст запроса или список сообщений
- `instruction` (str, опционально): Системная инструкция
- `think` (bool, опционально): Использовать модель с более глубоким мышлением
- `uncensored` (bool, опционально): Использовать режим без ограничений

### create_image

- `prompt` (str): Описание желаемого изображения
- `samples` (int, опционально): Количество образцов
- `resolution` (tuple, опционально): Разрешение изображения (ширина, высота)
- `seed` (int, опционально): Сид для воспроизводимости
- `steps` (int, опционально): Количество шагов генерации
- `negative_prompt` (str, опционально): Описание нежелательных элементов

## Безопасность

Библиотека использует HMAC-SHA256 для подписи запросов и обеспечивает безопасную передачу данных. Все запросы аутентифицируются с использованием временных меток для предотвращения атак повторного воспроизведения.

## Требования

- Python 3.8+

## Лицензия

MIT License

Copyright (c) 2025 RedPiar

## Автор

[RedPiar](https://t.me/RedPiar)

[^1]: Dummy предназначен для сжатия контекста и данных в целом, очень полезен для систем с малым запасом ОЗУ. также его можно сохранять для ещё большей экономии места!
