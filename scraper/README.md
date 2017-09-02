# hongkong_flowers

## 1) Data Collection Stage:

### scrape data from python
$ python ./scrape.py -n 100 -f list.csv -p /mnt/scratch/flowers/images/

takes a file that looks like this:

$ csvlook list.csv

|    編號 | 更多資料 | 學名                                          | 中文名         | 中文別名        | 英文名                         | 英文別名                   | 科                | 習性     | search_term                                |
| ----- | ---- | ------------------------------------------- | ----------- | ----------- | --------------------------- | ---------------------- | ---------------- | ------ | ------------------------------------------ |
|    14 | 進入   | Alangium chinense                           | 八角楓         | 水芒樹         | Chinese-Alangium            | NoInfo                 | ALANGIACEAE八角楓科  | 喬木_灌木  | Alangium chinense                          |
|    83 | 進入   | Cerbera manghas                             | 海芒果         | 海果          | Cerbera-Sea-Mango           | NoInfo                 | APOCYNACEAE夾竹桃科  | 喬木     | Cerbera manghas                            |
|   334 | 進入   | Rhus chinensis                              | 鹽膚木         | 沒資料         | Sumac                       | NoInfo                 | ANACARDIACEAE漆樹科 | 喬木     | Rhus chinensis                             |
|   335 | 進入   | Rhus hypoleuca                              | 白背鹽膚木       | 白背漆         | Sumac                       | NoInfo                 | ANACARDIACEAE漆樹科 | 喬木     | Rhus hypoleuca                             |
|   473 | 進入   | Ilex rotunda                                | 鐵冬青         | 沒資料         | Chinese Holly               | Panaceae Holly         | AQUIFOLIACEAE冬青科 | 喬木     | Ilex rotunda                               |
|   516 | 進入   | Plumeria rubra var. sp.(TBC)                | 雞蛋花(黃色)     | 沒資料         | NoInfo                      | NoInfo                 | APOCYNACEAE夾竹桃科  | 落葉小喬木  | Plumeria rubra var sp                      |
|   701 | 進入   | Odontonema strictum                         | 紅樓花         | 沒資料         | NoInfo                      | NoInfo                 | ACANTHACEAE爵床科   | 灌木     | Odontonema strictum                        |
|   701 | 進入   | Odontonema strictum                         | 紅樓花         | 沒資料         | NoInfo                      | NoInfo                 | ACANTHACEAE爵床科   | 灌木     | Odontonema strictum                        |
|   703 | 進入   | Thunbergia erecta                           | 硬枝老鴉嘴       | 沒資料         | Bush Thunbergia             | NoInfo                 | ACANTHACEAE爵床科   | 灌木     | Thunbergia erecta                          |

