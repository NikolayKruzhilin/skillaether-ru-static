# Системы Процедурной Генерации (PCG)

## Гайд по выбору Алгоритма
| Задача | Алгоритм |
|------|-----------|
| Комнаты 2D подземелья | BSP Tree (Двоичное разбиение планиметрии) |
| Пещеры и каверны | Клеточные автоматы (Cellular Automata) |
| Природный ландшафт | Шум Перлина / Симплекс-шум |
| Дорожные сети | Диаграммы Вороного |
| Таблицы лута | Взвешенный рандом (Weighted Random) |
| Имена / Слова | Цепи Маркова |
| Квесты | Грамматические системы (Grammar Systems) |

## Генератор подземелий BSP (псевдокод)
```
function split(area, min_size):
  if area too small: return Leaf(area)
  direction = random(horizontal, vertical)
  split_point = random(0.4 * size, 0.6 * size)
  left = split(area.left_half, min_size)
  right = split(area.right_half, min_size)
  connect_closest_rooms(left, right)
  return Node(left, right)
```

## Пещеры на клеточных автоматах
```python
# Шаг 1: Рандомное заполнение (45% стен)
grid = [[random() < 0.45 for x in range(W)] for y in range(H)]

# Шаг 2: Сглаживание 4-5 раз
for _ in range(5):
    new_grid = copy(grid)
    for x, y in all_cells:
        neighbors = count_wall_neighbors(x, y)
        new_grid[x][y] = neighbors >= 5  # правило жизни/смерти
    grid = new_grid
```

## Таблицы лута с весами
```python
loot_table = [
    ("common_sword", 60),      # обычный
    ("rare_bow", 25),          # редкий
    ("epic_staff", 12),        # эпик
    ("legendary_blade", 3),    # лега
]

def roll_loot(table, luck_modifier=0):
    adjusted = [(item, max(1, weight + luck_modifier)) for item, weight in table]
    total = sum(w for _, w in adjusted)
    r = random() * total
    for item, weight in adjusted:
        r -= weight
        if r <= 0: return item
```

## Тюнинг Параметров
Всегда выноси эти настройки для геймдизайнеров:
- Сид (Seed) — для воспроизводимости
- Плотность / Коэффициент заполнения
- Мин/макс размер комнат / зон
- Ширина коридоров
- Множитель качества лута
